import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.text();
    const event: Stripe.Event = JSON.parse(body);

    console.log('Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const donationId = session.metadata?.donation_id;

        console.log('Session metadata:', session.metadata);
        console.log('Donation ID:', donationId);
        console.log('Session ID:', session.id);

        if (!donationId) {
          console.error('No donation_id in session metadata');
          break;
        }

        const updateData: any = {
          status: 'completed',
          completed_at: new Date().toISOString(),
          stripe_customer_id: session.customer as string,
        };

        if (session.payment_intent) {
          updateData.stripe_payment_intent_id = session.payment_intent as string;
        }

        if (session.subscription) {
          updateData.stripe_subscription_id = session.subscription as string;
        }

        console.log('Updating donation with data:', updateData);

        const { data: updatedDonation, error: updateError } = await supabase
          .from('donations')
          .update(updateData)
          .eq('id', donationId)
          .select();

        if (updateError) {
          console.error('Error updating donation:', updateError);
        } else {
          console.log('Successfully updated donation:', updatedDonation);
        }

        await supabase
          .from('donation_events')
          .insert({
            donation_id: donationId,
            event_type: 'payment_completed',
            event_data: {
              session_id: session.id,
              payment_status: session.payment_status,
            },
            source: 'stripe-webhook',
          });

        const donorId = session.metadata?.donor_id;
        if (donorId) {
          try {
            const mailchimpResponse = await fetch(
              `${supabaseUrl}/functions/v1/sync-mailchimp`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                  donorId: donorId,
                  donationId: donationId,
                  tags: ['donation_completed'],
                  sendEmail: true,
                }),
              }
            );

            if (!mailchimpResponse.ok) {
              const mailchimpError = await mailchimpResponse.json();
              console.error('Mailchimp sync failed:', mailchimpError);
            } else {
              console.log('Donor synced to Mailchimp successfully');
            }
          } catch (mailchimpError) {
            console.error('Error calling Mailchimp sync:', mailchimpError);
          }
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const donationId = session.metadata?.donation_id;

        if (!donationId) break;

        await supabase
          .from('donations')
          .update({ status: 'cancelled' })
          .eq('id', donationId);

        await supabase
          .from('donation_events')
          .insert({
            donation_id: donationId,
            event_type: 'checkout_expired',
            event_data: { session_id: session.id },
            source: 'stripe-webhook',
          });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const { data: donation } = await supabase
          .from('donations')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .maybeSingle();

        if (donation) {
          await supabase
            .from('donations')
            .update({ status: 'failed' })
            .eq('id', donation.id);

          await supabase
            .from('donation_events')
            .insert({
              donation_id: donation.id,
              event_type: 'payment_failed',
              event_data: {
                payment_intent_id: paymentIntent.id,
                failure_message: paymentIntent.last_payment_error?.message,
              },
              source: 'stripe-webhook',
            });
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        const { data: donation } = await supabase
          .from('donations')
          .select('id')
          .eq('stripe_payment_intent_id', charge.payment_intent as string)
          .maybeSingle();

        if (donation) {
          await supabase
            .from('donations')
            .update({ status: 'refunded' })
            .eq('id', donation.id);

          await supabase
            .from('donation_events')
            .insert({
              donation_id: donation.id,
              event_type: 'payment_refunded',
              event_data: {
                charge_id: charge.id,
                amount_refunded: charge.amount_refunded,
              },
              source: 'stripe-webhook',
            });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
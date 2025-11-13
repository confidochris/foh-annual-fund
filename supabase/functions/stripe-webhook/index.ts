import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";
import { Resend } from "npm:resend@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

const RESEND_API_KEY = 're_6HqjnGXg_JHJuDBE71F9F7iC212aXCW7Y';
const ONE_TIME_TEMPLATE_ID = 'f32637a1-e23e-475a-b10a-1027e511f6ce';
const RECURRING_TEMPLATE_ID = '0d15502a-7950-4687-a460-3790a6275990';

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

    const resend = new Resend(RESEND_API_KEY);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    let event: Stripe.Event;
    
    if (signature) {
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        event = JSON.parse(body);
      }
    } else {
      event = JSON.parse(body);
    }

    console.log('Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session completed:', session.id);

        const donationId = session.metadata?.donation_id;
        if (!donationId) {
          console.error('No donation_id in session metadata');
          break;
        }

        const { data: donation, error: fetchError } = await supabase
          .from('donations')
          .select('*, donors(first_name, last_name, email)')
          .eq('id', donationId)
          .single();

        if (fetchError || !donation) {
          console.error('Error fetching donation:', fetchError);
          break;
        }

        const { error: updateError } = await supabase
          .from('donations')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_subscription_id: session.subscription as string || null,
            completed_at: new Date().toISOString(),
          })
          .eq('id', donationId);

        if (updateError) {
          console.error('Error updating donation:', updateError);
        }

        await supabase
          .from('donation_events')
          .insert({
            donation_id: donationId,
            event_type: 'payment_completed',
            event_data: { session_id: session.id },
            source: 'stripe-webhook',
          });

        if (donation.donors && donation.donors.email) {
          const donor = donation.donors;
          const isRecurring = donation.donation_type === 'recurring';
          const templateId = isRecurring ? RECURRING_TEMPLATE_ID : ONE_TIME_TEMPLATE_ID;

          console.log('Attempting to send email to:', donor.email, 'with template:', templateId);

          try {
            const emailResponse = await resend.emails.send({
              from: 'Foundation of Hope <donations@walkforhope.com>',
              to: donor.email,
              template: {
                id: templateId
              },
            });

            console.log('Resend API response:', JSON.stringify(emailResponse));

            if (emailResponse.error) {
              console.error('Resend returned error:', emailResponse.error);
              
              await supabase
                .from('donation_events')
                .insert({
                  donation_id: donationId,
                  event_type: 'email_failed',
                  event_data: { 
                    error: emailResponse.error,
                    email: donor.email,
                    template_id: templateId
                  },
                  source: 'stripe-webhook',
                });
            } else {
              console.log('Email sent successfully to:', donor.email, 'ID:', emailResponse.data?.id);

              await supabase
                .from('donation_events')
                .insert({
                  donation_id: donationId,
                  event_type: 'email_sent',
                  event_data: { 
                    email: donor.email, 
                    type: isRecurring ? 'recurring' : 'one_time',
                    provider: 'resend',
                    template_id: templateId,
                    email_id: emailResponse.data?.id
                  },
                  source: 'stripe-webhook',
                });
            }
          } catch (emailError) {
            console.error('Exception sending email:', emailError);
            console.error('Error details:', JSON.stringify(emailError, null, 2));
            
            await supabase
              .from('donation_events')
              .insert({
                donation_id: donationId,
                event_type: 'email_failed',
                event_data: { 
                  error: emailError.message || String(emailError),
                  email: donor.email,
                  template_id: templateId
                },
                source: 'stripe-webhook',
              });
          }
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
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
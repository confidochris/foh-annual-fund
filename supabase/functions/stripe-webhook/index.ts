import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";
import { Resend } from "npm:resend@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

const getOneTimeEmailTemplate = (firstName: string, amount: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #2BB673 0%, #1F8A52 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Gift!</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${firstName},</p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        We are deeply grateful for your generous donation of <strong style="color: #2BB673;">$${amount.toFixed(2)}</strong> to the Foundation of Hope. Your gift brings us closer to breakthroughs that will transform mental health care.
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #2BB673; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.6;">
          <strong>Your Impact:</strong> Every dollar you give stays right here in our community, fueling critical research that brings hope and healing to those who need it most.
        </p>
      </div>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        Your contribution is fully tax-deductible. A tax receipt will be sent to you separately for your records.
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        Thank you for being the difference in our community.
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 10px;">
        With gratitude,<br>
        <strong>The Foundation of Hope Team</strong>
      </p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
      <p style="margin: 0; font-size: 14px; color: #6c757d;">
        Foundation of Hope | San Diego, CA<br>
        <a href="https://www.walkforhope.com" style="color: #2BB673; text-decoration: none;">www.walkforhope.com</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

const getRecurringEmailTemplate = (firstName: string, amount: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #2BB673 0%, #1F8A52 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Our Monthly Giving Community!</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${firstName},</p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        Thank you for joining our monthly giving community with your commitment of <strong style="color: #2BB673;">$${amount.toFixed(2)} per month</strong>. Your sustained support makes a profound difference in advancing mental health research.
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #2BB673; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0 0 15px 0; font-size: 16px; color: #333; line-height: 1.6;">
          <strong>As a Monthly Donor, You Will:</strong>
        </p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #555;">
          <li style="margin-bottom: 8px;">Provide steady, reliable funding for groundbreaking research</li>
          <li style="margin-bottom: 8px;">Receive quarterly updates on the impact of your giving</li>
          <li style="margin-bottom: 8px;">Be part of a committed community working toward mental health breakthroughs</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        Your monthly gift will be processed automatically, and you'll receive a tax receipt for your annual contributions. You can update or cancel your recurring donation at any time by contacting us.
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 20px;">
        Thank you for making such a meaningful commitment to our community.
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 10px;">
        With deep appreciation,<br>
        <strong>The Foundation of Hope Team</strong>
      </p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
      <p style="margin: 0; font-size: 14px; color: #6c757d;">
        Foundation of Hope | San Diego, CA<br>
        <a href="https://www.walkforhope.com" style="color: #2BB673; text-decoration: none;">www.walkforhope.com</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
          const firstName = donor.first_name || 'Friend';
          const amount = parseFloat(donation.amount);
          const isRecurring = donation.donation_type === 'recurring';

          const emailSubject = isRecurring 
            ? 'Thank You for Your Monthly Commitment!'
            : 'Thank You for Your Generous Gift!';

          const emailHtml = isRecurring
            ? getRecurringEmailTemplate(firstName, amount)
            : getOneTimeEmailTemplate(firstName, amount);

          try {
            await resend.emails.send({
              from: 'Foundation of Hope <donations@walkforhope.com>',
              to: donor.email,
              subject: emailSubject,
              html: emailHtml,
            });

            console.log('Email sent successfully to:', donor.email);

            await supabase
              .from('donation_events')
              .insert({
                donation_id: donationId,
                event_type: 'email_sent',
                event_data: { 
                  email: donor.email, 
                  type: isRecurring ? 'recurring' : 'one_time',
                  provider: 'resend'
                },
                source: 'stripe-webhook',
              });
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            
            await supabase
              .from('donation_events')
              .insert({
                donation_id: donationId,
                event_type: 'email_failed',
                event_data: { 
                  error: emailError.message,
                  email: donor.email
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
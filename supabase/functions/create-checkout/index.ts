import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organization?: string;
  referralSource?: string;
  referralCustom?: string;
  amount: number;
  donationType: 'one_time' | 'recurring';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_TEST_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const data: CheckoutRequest = await req.json();

    const { email, firstName, lastName, phone, organization, referralSource, referralCustom, amount, donationType } = data;

    if (!email || !amount || !donationType) {
      throw new Error('Missing required fields');
    }

    let donor;
    const { data: existingDonor } = await supabase
      .from('donors')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingDonor) {
      const { data: updatedDonor } = await supabase
        .from('donors')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          organization: organization,
          referral_source: referralSource,
          referral_custom: referralCustom,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingDonor.id)
        .select()
        .single();
      donor = updatedDonor;
    } else {
      const { data: newDonor } = await supabase
        .from('donors')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          organization,
          referral_source: referralSource,
          referral_custom: referralCustom,
        })
        .select()
        .single();
      donor = newDonor;
    }

    if (!donor) {
      throw new Error('Failed to create or update donor');
    }

    const { data: donation } = await supabase
      .from('donations')
      .insert({
        donor_id: donor.id,
        amount: amount,
        currency: 'USD',
        donation_type: donationType,
        status: 'pending',
      })
      .select()
      .single();

    if (!donation) {
      throw new Error('Failed to create donation');
    }

    await supabase
      .from('donation_events')
      .insert({
        donation_id: donation.id,
        event_type: 'checkout_initiated',
        event_data: { amount, donationType, referralSource },
        source: 'create-checkout',
      });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: donationType === 'recurring' ? 'Monthly Donation' : 'One-Time Donation',
              description: 'Thank you for your support!',
            },
            unit_amount: Math.round(amount * 100),
            ...(donationType === 'recurring' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: donationType === 'recurring' ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/?cancelled=true`,
      customer_email: email,
      metadata: {
        donation_id: donation.id,
        donor_id: donor.id,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    await supabase
      .from('donations')
      .update({
        stripe_checkout_id: session.id,
        stripe_customer_id: session.customer as string,
      })
      .eq('id', donation.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating checkout:', error);
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
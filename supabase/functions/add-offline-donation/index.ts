import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { amount, first_name, last_name, donor_email, notes } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let donorId = null;

    if (first_name || last_name || donor_email) {
      const firstName = first_name?.trim() || '';
      const lastName = last_name?.trim() || '';

      if (donor_email) {
        const { data: existingDonor } = await supabase
          .from('donors')
          .select('id')
          .eq('email', donor_email)
          .maybeSingle();

        if (existingDonor) {
          donorId = existingDonor.id;
        } else {
          const { data: newDonor, error: donorError } = await supabase
            .from('donors')
            .insert({
              email: donor_email,
              first_name: firstName,
              last_name: lastName,
            })
            .select('id')
            .single();

          if (!donorError && newDonor) {
            donorId = newDonor.id;
          }
        }
      } else if (firstName) {
        const { data: newDonor, error: donorError } = await supabase
          .from('donors')
          .insert({
            first_name: firstName,
            last_name: lastName,
          })
          .select('id')
          .single();

        if (!donorError && newDonor) {
          donorId = newDonor.id;
        }
      }
    }

    const metadata: any = {
      source: 'admin_offline',
      is_offline: true,
    };
    if (notes) metadata.notes = notes;

    const { data, error } = await supabase
      .from('donations')
      .insert({
        amount: amount,
        currency: 'USD',
        donation_type: 'one_time',
        status: 'completed',
        completed_at: new Date().toISOString(),
        donor_id: donorId,
        metadata: metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting donation:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to add donation', details: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, donation: data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
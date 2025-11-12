import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import crypto from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SyncRequest {
  donorId: string;
  tags?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const mailchimpApiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const mailchimpListId = Deno.env.get('MAILCHIMP_LIST_ID');
    const mailchimpServerPrefix = Deno.env.get('MAILCHIMP_SERVER_PREFIX');

    if (!mailchimpApiKey || !mailchimpListId || !mailchimpServerPrefix) {
      throw new Error('Mailchimp configuration missing. Please set MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, and MAILCHIMP_SERVER_PREFIX');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { donorId, tags = [] }: SyncRequest = await req.json();

    if (!donorId) {
      throw new Error('donorId is required');
    }

    const { data: donor, error: donorError } = await supabase
      .from('donors')
      .select('*')
      .eq('id', donorId)
      .single();

    if (donorError || !donor) {
      throw new Error('Donor not found');
    }

    const subscriberHash = crypto
      .createHash('md5')
      .update(donor.email.toLowerCase())
      .digest('hex');

    const mailchimpData = {
      email_address: donor.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: donor.first_name || '',
        LNAME: donor.last_name || '',
        PHONE: donor.phone || '',
        MMERGE6: donor.organization || '',
      },
      tags: ['donor', ...tags],
    };

    const mailchimpUrl = `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members/${subscriberHash}`;

    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${mailchimpApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    const mailchimpResult = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      console.error('Mailchimp error:', mailchimpResult);
      throw new Error(`Mailchimp API error: ${mailchimpResult.detail || mailchimpResult.title || 'Unknown error'}`);
    }

    await supabase
      .from('donors')
      .update({
        mailchimp_id: mailchimpResult.id,
        mailchimp_status: mailchimpResult.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', donorId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        mailchimp_id: mailchimpResult.id,
        mailchimp_status: mailchimpResult.status,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error syncing with Mailchimp:', error);
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
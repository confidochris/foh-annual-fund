import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.81.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data: recentDonations, error: recentError } = await supabase
      .from("donations")
      .select("amount, created_at, donor_id, donors(first_name, last_name)")
      .gte("created_at", twentyFourHoursAgo.toISOString());

    if (recentError) {
      throw new Error(`Failed to fetch recent donations: ${recentError.message}`);
    }

    const { data: allDonations, error: allError } = await supabase
      .from("donations")
      .select("amount");

    if (allError) {
      throw new Error(`Failed to fetch all donations: ${allError.message}`);
    }

    const newGifts = recentDonations?.length || 0;
    const totalAmount = recentDonations?.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) || 0;
    const runningTotal = allDonations?.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) || 0;

    const majorDonors = recentDonations
      ?.filter(d => parseFloat(d.amount) >= 500)
      .map(d => {
        const donor = d.donors;
        const firstName = donor?.first_name || "Anonymous";
        const lastName = donor?.last_name || "";
        return `${firstName} ${lastName} - $${parseFloat(d.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      })
      .join("<br>") || "None";

    const emailPayload = {
      from: "donations@walkforhope.com",
      to: "chris@walkforhope.com",
      subject: "Your Daily Annual Fund Donation Snack (TEST)",
      react: "bfd9a701-7bd7-4541-85dd-97376732346f",
      new_gifts: newGifts.toString(),
      total_amount: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      running_total: `$${runningTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      MAJOR_DONORS: majorDonors
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });

    const responseText = await resendResponse.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { raw: responseText };
    }

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResponse.status} - ${responseText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test email sent successfully to chris@walkforhope.com",
        stats: {
          new_gifts: newGifts,
          total_amount: totalAmount,
          running_total: runningTotal,
          major_donors_count: recentDonations?.filter(d => parseFloat(d.amount) >= 500).length || 0
        },
        resend_response: result
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending test summary:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
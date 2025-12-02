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
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="background: linear-gradient(to bottom, #e0f2f1, #b2dfdb); padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(to bottom, #e0f2f1, #b2dfdb); padding: 40px 20px; text-align: center;">
        <div style="display: inline-block;">
          <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2e7d32;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#66bb6a;stop-opacity:1" />
              </linearGradient>
            </defs>
            <g transform="translate(100, 40)">
              <path d="M -30,-10 L -20,-30 L -10,-10" fill="url(#grad1)" />
              <path d="M -10,-10 L 0,-35 L 10,-10" fill="url(#grad1)" />
              <path d="M 10,-10 L 20,-30 L 30,-10" fill="url(#grad1)" />
            </g>
            <text x="100" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-style="italic" fill="#424242">FOUNDATION </text>
            <text x="130" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-style="italic" fill="#424242" font-weight="300">of</text>
            <text x="100" y="145" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#2e7d32">HOPE</text>
            <text x="100" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">Breakthrough Research for Mental Illness</text>
          </svg>
        </div>
      </div>
      <div style="padding: 40px 30px;">
        <p style="font-size: 18px; color: #333; margin: 0 0 30px 0;">Good afternoon, team!</p>
        <p style="font-size: 16px; color: #333; margin: 0 0 30px 0;">Here's your <strong>24-hour snapshot</strong> of the generosity powering our Annual Fund:</p>
        <div style="margin: 30px 0;">
          <p style="font-size: 16px; color: #333; margin: 10px 0;">💚 <strong>New Gifts:</strong> ${newGifts}</p>
          <p style="font-size: 16px; color: #333; margin: 10px 0;">💰 <strong>Total Raised in the Last 24 Hours:</strong> $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style="font-size: 16px; color: #333; margin: 10px 0;">📈 <strong>Running Total for the Annual Fund:</strong> $${runningTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <p style="font-size: 16px; color: #333; margin: 30px 0 10px 0;">Donations received in the last 24 hours above $500:</p>
        <div style="font-size: 15px; color: #555; margin: 10px 0 30px 20px;">${majorDonors}</div>
        <p style="font-size: 16px; color: #333; margin: 30px 0 10px 0;">See you tomorrow for the next update!</p>
        <p style="font-size: 16px; color: #333; margin: 30px 0 5px 0;">Gratefully,</p>
        <p style="font-size: 16px; color: #333; margin: 0;">Hope HQ AI Bot (you need to name me!)</p>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 5px 0;">The Foundation of Hope is a 501(c)(3) non-profit organization - Federal Tax ID #56-6246626.</p>
        <p style="margin: 5px 0;">9401 Glenwood Ave, Raleigh, NC 27617 • 919-781-9255 • www.walkforhope.com</p>
      </div>
    </div>
  </div>
</body>
</html>
      `
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
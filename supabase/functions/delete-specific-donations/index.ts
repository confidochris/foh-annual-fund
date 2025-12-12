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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const deletedDonations = [];
    const errors = [];

    console.log('Starting deletion process...');

    // 1. Delete Youneed Toremoveme's $5000 donation
    const { data: youneedDonor, error: youneedDonorError } = await supabase
      .from('donors')
      .select('id, first_name, last_name')
      .or('first_name.ilike.%youneed%,last_name.ilike.%toremoveme%')
      .maybeSingle();

    if (youneedDonor) {
      console.log(`Found Youneed donor: ${youneedDonor.first_name} ${youneedDonor.last_name}`);

      const { data: youneedDonations, error: youneedDonationsError } = await supabase
        .from('donations')
        .select('id, amount')
        .eq('donor_id', youneedDonor.id)
        .eq('amount', 5000);

      if (youneedDonations && youneedDonations.length > 0) {
        for (const donation of youneedDonations) {
          const { error: deleteError } = await supabase
            .from('donations')
            .delete()
            .eq('id', donation.id);

          if (deleteError) {
            console.error('Error deleting Youneed donation:', deleteError);
            errors.push({ donor: 'Youneed Toremoveme', amount: donation.amount, error: deleteError.message });
          } else {
            console.log('Deleted Youneed donation:', donation.id);
            deletedDonations.push({ donor: 'Youneed Toremoveme', amount: 5000 });
          }
        }
      }
    }

    // 2. Delete Chris Boyd pending donations
    const { data: chrisDonor, error: chrisDonorError } = await supabase
      .from('donors')
      .select('id, first_name, last_name, email')
      .ilike('email', '%chris@walkforhope.com%')
      .maybeSingle();

    if (chrisDonor) {
      console.log(`Found Chris donor: ${chrisDonor.email}`);

      const { data: chrisDonations, error: chrisDonationsError } = await supabase
        .from('donations')
        .select('id, amount, status')
        .eq('donor_id', chrisDonor.id)
        .eq('status', 'pending');

      if (chrisDonations && chrisDonations.length > 0) {
        for (const donation of chrisDonations) {
          const { error: deleteError } = await supabase
            .from('donations')
            .delete()
            .eq('id', donation.id);

          if (deleteError) {
            console.error('Error deleting Chris donation:', deleteError);
            errors.push({ donor: 'Chris Boyd', amount: donation.amount, error: deleteError.message });
          } else {
            console.log('Deleted Chris donation:', donation.id);
            deletedDonations.push({ donor: 'Chris Boyd', amount: donation.amount });
          }
        }
      }
    }

    // 3. Delete Larisa Karikh pending donations
    const { data: larisaDonor, error: larisaDonorError } = await supabase
      .from('donors')
      .select('id, first_name, last_name, email')
      .or('email.ilike.%christopher.f.boyd@gmail.com%,first_name.ilike.%larisa%')
      .maybeSingle();

    if (larisaDonor) {
      console.log(`Found Larisa donor: ${larisaDonor.first_name} ${larisaDonor.last_name}`);

      const { data: larisaDonations, error: larisaDonationsError } = await supabase
        .from('donations')
        .select('id, amount, status')
        .eq('donor_id', larisaDonor.id)
        .eq('status', 'pending');

      if (larisaDonations && larisaDonations.length > 0) {
        for (const donation of larisaDonations) {
          const { error: deleteError } = await supabase
            .from('donations')
            .delete()
            .eq('id', donation.id);

          if (deleteError) {
            console.error('Error deleting Larisa donation:', deleteError);
            errors.push({ donor: 'Larisa Karikh', amount: donation.amount, error: deleteError.message });
          } else {
            console.log('Deleted Larisa donation:', donation.id);
            deletedDonations.push({ donor: 'Larisa Karikh', amount: donation.amount });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        deleted: deletedDonations,
        errors: errors,
        message: `Deleted ${deletedDonations.length} donations${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
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

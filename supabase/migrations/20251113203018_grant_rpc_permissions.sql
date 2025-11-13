/*
  # Grant RPC Function Permissions

  1. Security
    - Grant EXECUTE permission on get_donation_progress function to anon and authenticated users
    - This allows the frontend to call the function to fetch donation progress
*/

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_donation_progress() TO anon, authenticated;
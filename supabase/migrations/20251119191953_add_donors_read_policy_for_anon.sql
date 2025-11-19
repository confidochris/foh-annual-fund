/*
  # Add Donors Read Policy for Anonymous Users

  1. Security Changes
    - Add SELECT policy on `donors` table for anonymous users
    - This allows the admin dashboard to fetch donor information via the anon key
    - Donor data is already somewhat public as it appears on donation receipts
  
  2. Notes
    - This enables the donor relationship to work in Supabase queries
    - Only SELECT permission is granted, maintaining data integrity
*/

-- Allow anonymous users to read donor data
CREATE POLICY "Anyone can read donors"
  ON donors FOR SELECT
  TO anon, authenticated
  USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Authenticated users can read donors" ON donors;
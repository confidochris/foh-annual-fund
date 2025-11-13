/*
  # Fix Security Issues

  1. Performance Improvements
    - Add index on `donation_events.donation_id` foreign key
    - Add index on `donations.donor_id` foreign key
  
  2. RLS Policy Cleanup
    - Drop duplicate policy "Authenticated users can read donations"
    - Keep "Anyone can view donations" which covers both anon and authenticated
  
  3. Function Security
    - Fix `get_donation_progress` function to use immutable search_path
    - Add SECURITY DEFINER with proper search_path to prevent SQL injection
  
  4. Notes
    - Indexes improve query performance on foreign key lookups
    - Single permissive policy is cleaner and sufficient for public read access
    - Setting search_path in function prevents role mutable search_path vulnerability
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_donation_events_donation_id 
  ON donation_events(donation_id);

CREATE INDEX IF NOT EXISTS idx_donations_donor_id 
  ON donations(donor_id);

-- Remove duplicate SELECT policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can read donations" ON donations;

-- Recreate get_donation_progress function with secure search_path
CREATE OR REPLACE FUNCTION get_donation_progress()
RETURNS TABLE (
  total_raised numeric,
  goal_amount numeric,
  donor_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(d.amount), 0) as total_raised,
    COALESCE((SELECT cs.goal_amount FROM campaign_settings cs LIMIT 1), 100000) as goal_amount,
    COUNT(d.id) as donor_count
  FROM donations d;
END;
$$;

-- Ensure permissions are still granted
GRANT EXECUTE ON FUNCTION get_donation_progress() TO anon, authenticated;

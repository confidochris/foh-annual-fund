/*
  # Create Donations Tracking System

  1. New Tables
    - `donations`
      - `id` (uuid, primary key) - Unique identifier for each donation
      - `amount` (numeric) - Donation amount in dollars
      - `donor_email` (text, nullable) - Email of donor (if provided)
      - `donor_name` (text, nullable) - Name of donor (if provided)
      - `stripe_payment_id` (text, nullable) - Stripe payment intent ID for online donations
      - `donation_type` (text) - Either 'online' or 'offline'
      - `notes` (text, nullable) - Additional notes (for offline donations)
      - `created_at` (timestamptz) - When donation was recorded

    - `campaign_settings`
      - `id` (uuid, primary key) - Single row identifier
      - `goal_amount` (numeric) - Campaign goal amount in dollars
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access for viewing donation totals
    - Restricted write access (webhook service role only)

  3. Functions
    - Create view for calculating total donations
*/

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount > 0),
  donor_email text,
  donor_name text,
  stripe_payment_id text,
  donation_type text NOT NULL CHECK (donation_type IN ('online', 'offline')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create campaign settings table
CREATE TABLE IF NOT EXISTS campaign_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_amount numeric NOT NULL DEFAULT 100000,
  updated_at timestamptz DEFAULT now()
);

-- Insert default campaign goal if not exists
INSERT INTO campaign_settings (goal_amount)
SELECT 100000
WHERE NOT EXISTS (SELECT 1 FROM campaign_settings);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to view donation totals
CREATE POLICY "Anyone can view donations"
  ON donations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view campaign settings"
  ON campaign_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert donations (via webhook or admin function)
CREATE POLICY "Service role can insert donations"
  ON donations FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can update campaign settings
CREATE POLICY "Service role can update campaign settings"
  ON campaign_settings FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a function to get donation progress
CREATE OR REPLACE FUNCTION get_donation_progress()
RETURNS TABLE (
  total_raised numeric,
  goal_amount numeric,
  donor_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(d.amount), 0) as total_raised,
    COALESCE((SELECT cs.goal_amount FROM campaign_settings cs LIMIT 1), 100000) as goal_amount,
    COUNT(d.id) as donor_count
  FROM donations d;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
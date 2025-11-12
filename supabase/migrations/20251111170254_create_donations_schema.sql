/*
  # Create Donations System Schema

  ## Overview
  This migration creates a complete donation tracking system with Stripe and Mailchimp integration support.

  ## New Tables

  ### `donors`
  Stores donor contact information and preferences
  - `id` (uuid, primary key) - Unique donor identifier
  - `email` (text, unique, required) - Donor email address
  - `first_name` (text) - Donor first name
  - `last_name` (text) - Donor last name
  - `phone` (text) - Optional phone number
  - `mailchimp_id` (text) - Mailchimp subscriber ID for tracking
  - `mailchimp_status` (text) - Mailchimp subscription status (subscribed, unsubscribed, etc.)
  - `created_at` (timestamptz) - When donor record was created
  - `updated_at` (timestamptz) - When donor record was last updated

  ### `donations`
  Tracks all donation transactions
  - `id` (uuid, primary key) - Unique donation identifier
  - `donor_id` (uuid, foreign key) - References donors table
  - `amount` (decimal) - Donation amount in dollars
  - `currency` (text) - Currency code (default: USD)
  - `donation_type` (text) - Type: one_time or recurring
  - `status` (text) - Status: pending, completed, failed, refunded
  - `stripe_checkout_id` (text) - Stripe Checkout Session ID
  - `stripe_payment_intent_id` (text) - Stripe Payment Intent ID
  - `stripe_subscription_id` (text) - Stripe Subscription ID (for recurring)
  - `stripe_customer_id` (text) - Stripe Customer ID
  - `metadata` (jsonb) - Additional data (campaign info, etc.)
  - `completed_at` (timestamptz) - When payment was completed
  - `created_at` (timestamptz) - When donation record was created
  - `updated_at` (timestamptz) - When donation record was last updated

  ### `donation_events`
  Audit log for all donation-related events
  - `id` (uuid, primary key) - Unique event identifier
  - `donation_id` (uuid, foreign key) - References donations table
  - `event_type` (text) - Type of event (checkout_created, payment_succeeded, etc.)
  - `event_data` (jsonb) - Complete event payload
  - `source` (text) - Source of event (stripe, mailchimp, system)
  - `created_at` (timestamptz) - When event was recorded

  ## Security
  - Enable RLS on all tables
  - Public can insert donors and donations (for form submission)
  - Only authenticated admin users can read/update sensitive data
  - Event logs are append-only

  ## Indexes
  - Email lookups on donors table
  - Stripe ID lookups on donations table
  - Status filtering on donations table
*/

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  mailchimp_id text,
  mailchimp_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  donation_type text NOT NULL CHECK (donation_type IN ('one_time', 'recurring')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  stripe_checkout_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donation events table for audit trail
CREATE TABLE IF NOT EXISTS donation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_checkout_id ON donations(stripe_checkout_id);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_payment_intent_id ON donations(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donation_events_donation_id ON donation_events(donation_id);

-- Enable Row Level Security
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donors table
-- Allow public to insert donor records (for form submission)
CREATE POLICY "Public can insert donors"
  ON donors FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all donors
CREATE POLICY "Authenticated users can read donors"
  ON donors FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update donors
CREATE POLICY "Authenticated users can update donors"
  ON donors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for donations table
-- Allow public to insert donations (for form submission)
CREATE POLICY "Public can insert donations"
  ON donations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all donations
CREATE POLICY "Authenticated users can read donations"
  ON donations FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update donations
CREATE POLICY "Authenticated users can update donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for donation_events table
-- Allow public to insert events (for webhook processing)
CREATE POLICY "Public can insert donation events"
  ON donation_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read events
CREATE POLICY "Authenticated users can read donation events"
  ON donation_events FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

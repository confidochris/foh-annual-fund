/*
  # Add Organization and Referral Fields

  1. Changes to donors table
    - Add `organization` (text, optional) - Store organization name if donor is giving on behalf of org
    - Add `referral_source` (text, optional) - Track how donor heard about Foundation of Hope
    - Add `referral_custom` (text, optional) - Custom text when referral_source is "Other"
  
  2. Notes
    - These fields help track donor acquisition channels
    - Organization field supports corporate giving
    - All fields are optional to maintain flexibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'organization'
  ) THEN
    ALTER TABLE donors ADD COLUMN organization text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE donors ADD COLUMN referral_source text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'referral_custom'
  ) THEN
    ALTER TABLE donors ADD COLUMN referral_custom text;
  END IF;
END $$;
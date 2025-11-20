/*
  # Add Address Fields to Donors Table

  1. Changes to `donors` Table
    - Add `street_address` (text) - Street address of the donor
    - Add `city` (text) - City of the donor
    - Add `state` (text) - State or territory of the donor
    - Add `zip_code` (text) - ZIP code of the donor

  2. Notes
    - All address fields are optional to maintain backward compatibility
    - Fields use text type for flexibility with various address formats
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'street_address'
  ) THEN
    ALTER TABLE donors ADD COLUMN street_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'city'
  ) THEN
    ALTER TABLE donors ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'state'
  ) THEN
    ALTER TABLE donors ADD COLUMN state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE donors ADD COLUMN zip_code text;
  END IF;
END $$;
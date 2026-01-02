/*
  # Disable Daily Donation Summary Cron Job

  1. Changes
    - Unschedules the daily-donation-summary-4pm-est cron job
    - Campaign has ended, no longer need automated daily emails
    
  2. Notes
    - The cron job can be re-enabled later if needed
    - The edge function remains deployed but won't be called automatically
    - To verify removal: SELECT * FROM cron.job;
*/

-- Unschedule the daily donation summary email cron job
SELECT cron.unschedule('daily-donation-summary-4pm-est');

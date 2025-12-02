/*
  # Setup Daily Donation Summary Cron Job
  
  1. Configuration
    - Creates a cron job to send daily donation summary emails
    - Runs at 4:10 PM EST (21:10 UTC) every day
    - Calls the daily-donation-summary edge function via HTTP
    
  2. Security
    - Uses the service role key stored in vault for authentication
    - Function is publicly accessible (verify_jwt = false) to allow cron calls
    
  3. Notes
    - The cron schedule '10 21 * * *' means: minute 10, hour 21 (9pm UTC = 4pm EST), every day
    - The function will send emails to all 6 team members
    - If the job fails, check pg_cron logs with: SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
*/

-- Schedule the daily donation summary email to run at 4:10 PM EST (21:10 UTC)
SELECT cron.schedule(
  'daily-donation-summary',
  '10 21 * * *',
  $$
  SELECT
    net.http_post(
      url := (SELECT current_setting('app.settings.api_url', true)) || '/functions/v1/daily-donation-summary',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT current_setting('app.settings.service_role_key', true))
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

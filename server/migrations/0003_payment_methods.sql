DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academy_payment_requests' AND column_name = 'telebirr_reference'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academy_payment_requests' AND column_name = 'transaction_reference'
  ) THEN
    ALTER TABLE academy_payment_requests RENAME COLUMN telebirr_reference TO transaction_reference;
  END IF;
END $$;

ALTER TABLE academy_payment_requests
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'telebirr'
    CHECK (payment_method IN ('telebirr', 'cbe'));

ALTER TABLE academy_payment_requests
  ALTER COLUMN screenshot_mime DROP NOT NULL,
  ALTER COLUMN screenshot_data DROP NOT NULL;

ALTER TABLE academy_payment_settings
  ADD COLUMN IF NOT EXISTS cbe_account_number text NOT NULL DEFAULT '1000342413904';

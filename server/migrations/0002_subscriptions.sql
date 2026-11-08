CREATE TABLE IF NOT EXISTS academy_payment_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  telebirr_account_name text NOT NULL DEFAULT '',
  telebirr_account_number text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO academy_payment_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS academy_payment_requests (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clerk_user_id text NOT NULL,
  learner_email text NOT NULL DEFAULT '',
  amount_etb integer NOT NULL CHECK (amount_etb = 3900),
  telebirr_reference text NOT NULL UNIQUE,
  screenshot_mime text NOT NULL CHECK (screenshot_mime IN ('image/jpeg', 'image/png', 'image/webp')),
  screenshot_data bytea NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text,
  expires_at timestamptz,
  rejection_reason text
);

CREATE INDEX IF NOT EXISTS academy_payment_requests_learner_history_idx
  ON academy_payment_requests (clerk_user_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS academy_payment_requests_pending_idx
  ON academy_payment_requests (clerk_user_id)
  WHERE status = 'pending';

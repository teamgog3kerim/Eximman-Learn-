CREATE TABLE IF NOT EXISTS academy_learner_trials (
  clerk_user_id text PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now()
);

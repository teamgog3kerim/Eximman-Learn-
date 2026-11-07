CREATE TABLE IF NOT EXISTS academy_learner_progress (
  clerk_user_id text PRIMARY KEY,
  completed_chapters text[] NOT NULL DEFAULT '{}',
  quiz_scores jsonb NOT NULL DEFAULT '{}',
  certificate_id text,
  certificate_issued_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT academy_learner_progress_certificate_pair CHECK (
    (certificate_id IS NULL) = (certificate_issued_at IS NULL)
  )
);

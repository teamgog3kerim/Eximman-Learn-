# EthioDeploy deployment

This is a Node.js/Express web service with a Vite-built React frontend and PostgreSQL-backed learner data. EthioDeploy can auto-detect the Node app; the configured build and start commands are `npm run build` and `npm start`.

## Before deploying

1. Push the project to a GitHub repository and create an EthioDeploy Web Service from that repository.
2. Add a managed PostgreSQL add-on. EthioDeploy injects its connection string as `DATABASE_URL`.
3. Add these encrypted project environment variables:
   - `NODE_ENV=production`
   - `CLERK_PUBLISHABLE_KEY` — the production Clerk publishable key
   - `CLERK_SECRET_KEY` — the matching production Clerk secret key
4. Configure the Clerk production instance for the deployed domain. Enable Google sign-in, add the EthioDeploy hostname to Clerk's allowed domains/redirect URLs, and verify the Google OAuth consent/redirect configuration in Clerk. Keep both Clerk keys server/config secrets; never add them to the repository.
5. Deploy, then check `https://<your-project>.ethiodeploy.app/healthz`. A healthy response is `{"status":"ok"}`.
6. Sign in with the admin account `teamgog3@gmail.com` and set the Telebirr receiving account in the app's admin payment settings before accepting subscription requests.

The service listens on `0.0.0.0` using EthioDeploy's `PORT`. At startup it applies the idempotent SQL migrations in `server/migrations/`. Existing course content and calculator behavior remain part of the build.

## Operational notes

- Learner progress, payment requests, and receipt images are stored in PostgreSQL. Back up the database regularly and check the managed database's storage quota because payment receipts are stored as image bytes.
- The free hosting plan may sleep after inactivity; the first request after idle may take longer. Choose an always-on plan if that delay is not acceptable for learners.
- The built-in screenshot upload is limited to 5 MB and accepts JPEG, PNG, and WebP.
- Deploy from a trusted GitHub branch. Production access depends on the Clerk production keys, Google provider setup, and the `DATABASE_URL` supplied by the database add-on.

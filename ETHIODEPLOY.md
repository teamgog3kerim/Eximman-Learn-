# EthioDeploy fresh deployment

This is a Node.js/Express service with a Vite-built React frontend and PostgreSQL-backed learner data. Follow these steps when creating a new EthioDeploy project.

## Before deleting the old project

Deleting an EthioDeploy project or its attached database may permanently erase learner progress, payment requests, and account history. Export or back up any data you need before deleting it. A fresh PostgreSQL database starts empty; GitHub contains the app code, not the old database contents.

## Create and configure the new project

1. Push the latest `main` branch to GitHub and create a new EthioDeploy **Web Service** connected to that repository and branch.
2. Add a managed PostgreSQL database and attach its `DATABASE_URL` to the service. The server runs the idempotent SQL files in `server/migrations/` at startup; do not run the migrations manually.
3. In **Build & Deploy**, use Node.js 22 and set:
   - Install: `npx --yes --package=npm@10.9.4 npm install --no-audit --no-fund --package-lock=true`
   - Build: `npm run build`
   - Start: `npm start`
   - Health check: `/healthz`
4. Set the environment variables below in EthioDeploy's encrypted settings. `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CLERK_PROXY_URL` must be available during the build as well as at runtime.
5. Configure Clerk as described below. After EthioDeploy assigns the public domain, add that exact domain to the production Clerk instance's allowed origins/domains and redirect URLs.
6. Deploy from `main`. Confirm the generated Nixpacks plan uses the pinned npm 10.9.4 install command, the build completes, and `/healthz` returns HTTP 200 with `{"status":"ok"}`.
7. Sign in with the academy administrator account, check the admin workspace, and update and verify the CBE and Telebirr recipient details before telling learners to pay. The current administrator allowlist is `teamgog3@gmail.com`.
8. Smoke-test the public page, sign-in, course images and chapters, quizzes, progress save/reload, certificates, calculators, Amharic language selection, and payment request review. Use a test transaction reference; do not make a real payment as a deployment test.

The pinned install command is necessary because a prior Nixpacks build selected npm 9.9.4 and exited with “Exit handler never called.” npm 10.9.4 supports the Node 22.11.0 runtime shown in that build log. EthioDeploy's dashboard settings can override `nixpacks.toml`; if the generated plan still shows a different install command, update the dashboard field. The Docker warning about `$NIXPACKS_PATH` is separate from the npm failure. `.replit` and `replit.md` configure the Replit workspace, not EthioDeploy.

## Required environment variables

Set these in EthioDeploy's encrypted environment settings, not in Git:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV=production` | Serves the compiled Vite app and enables the production Clerk proxy. |
| `DATABASE_URL` | Injected by the PostgreSQL add-on. |
| `CLERK_PUBLISHABLE_KEY` | Production Clerk publishable key used by the Express middleware. |
| `CLERK_SECRET_KEY` | Matching production Clerk secret key; keep server-side only. |
| `VITE_CLERK_PUBLISHABLE_KEY` | The same publishable key, available during the Vite build. This value is public in the browser bundle. |
| `VITE_CLERK_PROXY_URL=/api/__clerk` | Same-origin Clerk proxy route provided by this app. |

`PORT` is assigned by EthioDeploy. The server already listens on `process.env.PORT` and `0.0.0.0`; do not hardcode or manually set the port.

## Clerk production setup

Use production Clerk keys, not development/test keys. Add the actual `https://<project-slug>.ethiodeploy.app` host to the production Clerk instance's allowed domains and redirect URLs. Enable Google sign-in and verify the Google OAuth consent/redirect configuration if Google is offered to learners. The browser publishable key must match the server publishable key; never put `CLERK_SECRET_KEY` in a `VITE_*` variable or the repository.

## Operations

- Learner progress and transaction-reference payment requests are stored in PostgreSQL. Back up the database and migrate existing production data separately; creating an add-on does not copy Replit database contents.
- The service has a `/healthz` endpoint, trusts one reverse proxy hop for HTTPS forwarding, and gracefully closes its HTTP server and PostgreSQL pool on termination.
- The EthioDeploy Free plan may sleep after inactivity; the first request after idle can take longer. Choose an always-on plan if that delay is not acceptable for learners.
- Before accepting paid subscriptions, verify the CBE and Telebirr receiving details in the app's admin payment settings.

Official provider guides: <https://ethiodeploy.com/deploy/replit> and <https://ethiodeploy.com/deploy/express>.

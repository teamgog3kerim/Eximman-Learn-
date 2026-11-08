# EthioDeploy deployment

This project is a Node.js/Express web service with a Vite-built React frontend and PostgreSQL-backed learner data. Use `npm install --no-audit --no-fund --package-lock=true` as the install command. The build-time CLI `esbuild` is a regular dependency so it is installed even when EthioDeploy sets `NODE_ENV=production`; Vite and its build plugins are also listed as regular dependencies. EthioDeploy's Build & Deploy settings override the repository config, so verify the command shown in the generated Nixpacks plan.

In EthioDeploy's **Build & Deploy → Install Command** field, set `npm install --no-audit --no-fund --package-lock=true`. A recent log showed the older command without `--include=dev`; this project now keeps the required `esbuild` CLI in regular dependencies, so the production-mode install includes it. The same log also ended with npm's generic “Exit handler never called” error, which does not reveal npm's underlying failure. If that npm error persists with this install command, obtain the complete npm debug log from the build worker before changing more dependencies. The Docker warning about `$NIXPACKS_PATH` is separate.
- Build: `npm run build`
- Start: `npm start`
- Runtime: Node.js 22

The install command retains `package-lock.json`; audit and funding requests are kept out of the install path and should be run separately. Set Build to `npm run build` and Start to `npm start`. Verify the generated Nixpacks plan contains the exact install command above; the dashboard override takes precedence over `nixpacks.toml`. `.replit`, `replit.nix`, and `replit.md` are Replit-only configuration.

## Create the EthioDeploy project

1. Push this repository to GitHub and create a Web Service project from the repository in EthioDeploy.
2. Add a managed PostgreSQL add-on. It supplies `DATABASE_URL`; the app runs the idempotent SQL migrations in `server/migrations/` before it starts serving traffic.
3. Set the health-check path to `/healthz`. It checks the database and returns `{"status":"ok"}` only when the service can reach it.
4. Configure the project's environment variables (see below), then deploy from the trusted default branch.
5. The default public URL is `https://<project-slug>.ethiodeploy.app`. Configure Clerk with the actual project URL after the slug is known.

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

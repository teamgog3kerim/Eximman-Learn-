# Run the Academy on Replit

This project is a React/Vite application served by Express with PostgreSQL-backed subscription requests for Telebirr and CBE.

- The Replit preview runs with `npm run dev` on port 5000; the Express server starts Vite in development.
- Run `npm run lint` for the TypeScript check.
- Run `npm run build` to create the production build in `dist/`.
- Clerk handles learner sign-in. The server grants the administrator role only to the verified `teamgog3@gmail.com` account.
- Enable Google sign-in for the development and production environments in Replit's Users & Auth settings.
- Learners choose Telebirr or CBE and submit a transaction reference; no screenshot upload is required.
- The CBE account is configured in the subscription migration. Admins can update the CBE and Telebirr recipients in payment settings.
- Admin review is manual and required before a 30-day subscription is active; a submitted reference alone does not verify a transfer.

## Remaining limits

- Course progress, quiz results, and theme preferences remain in the current browser and are not synchronized between devices.
- Certificates are local course-progress records, not accredited or independently verifiable credentials.
- Resource downloads are generated sample text summaries, not original PDF, Excel, or Word source files. Regulatory, customs, banking, export, and tax material has not been verified against current official sources. Check relevant authorities before relying on it.
- Calculator outputs are educational estimates, not financial, tax, or legal advice.

Do not claim a transfer was completed based only on a submitted reference; admin review is manual and is not bank API verification.

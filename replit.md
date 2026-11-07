# Run the Academy on Replit

This project is a React/Vite application served by Express with PostgreSQL-backed Telebirr subscription requests.

- The Replit preview runs with `npm run dev` on port 5000; the Express server starts Vite in development.
- Run `npm run lint` for the TypeScript check.
- Run `npm run build` to create the production build in `dist/`.
- Clerk handles learner sign-in. The server grants the administrator role only to the verified `teamgog3@gmail.com` account.
- Enable Google sign-in for the development and production environments in Replit's Users & Auth settings.
- The admin must configure the academy's Telebirr name and number before learners can submit receipts.
- Receipt images are validated and stored in PostgreSQL. Admin review is required before a 30-day subscription is active.

## Remaining limits

- Course progress, quiz results, and theme preferences remain in the current browser and are not synchronized between devices.
- Certificates are local course-progress records, not accredited or independently verifiable credentials.
- Resource downloads are generated sample text summaries, not original PDF, Excel, or Word source files. Regulatory, customs, banking, export, and tax material has not been verified against current official sources. Check relevant authorities before relying on it.
- Calculator outputs are educational estimates, not financial, tax, or legal advice.

Do not claim a transfer was completed based on an uploaded screenshot; admin review is manual and is not a Telebirr API verification.

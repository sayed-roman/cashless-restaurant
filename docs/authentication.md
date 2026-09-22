# Accounts and access

This increment adds email/password registration, login/logout, database sessions,
a customer account page, and server-side guards for checkout and the admin landing
page. Existing menu browsing stays public. Reservation persistence, real orders,
Stripe payments and admin management screens are separate next steps.

## Setup

1. Install the locked dependencies with `npm ci`.
2. Keep the existing DATABASE_URL in `.env`. Add BETTER_AUTH_URL with the exact
   application origin (locally `http://localhost:3000`). Generate a private secret:
   `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`
   Set BETTER_AUTH_SECRET to that value. Never commit `.env` or share the secret.
3. Run `npm run db:migrate` and `npm run db:generate`.
4. Start `npm run dev` and register your account at `/register`.
5. To grant an existing account admin access, run
   `npm run admin:promote -- your-email@example.com` in your own terminal.
   Sign out and back in to refresh account navigation. No public endpoint grants roles.

For deployment, configure the same environment variables on the host, use the
actual HTTPS origin, apply migrations before serving traffic, and retain the
same secret across restarts. Configure trusted proxy IP handling for the deployment
before relying on per-IP rate limits. No database URL belongs in NEXT_PUBLIC variables.

## Design and security

- Better Auth owns password hashing, session cookies and auth endpoints.
- Registration cannot supply the role field. Admin guards re-read the database role.
- Checkout/account/admin authorization runs on the server. Future mutation APIs
  must independently authorize requests; hiding UI alone is not authorization.
- Return destinations are allowlisted to prevent external redirects.
- Rate limits use the database and include sign-in/sign-up limits.
- Login uses client navigation so the existing in-memory cart survives the flow.
- Email verification and password recovery are not configured in this increment.
  Account emails must not be treated as verified contact addresses.

## Review before committing

- Create an account; verify it appears with role customer in Prisma Studio.
- Log out, then log in; refresh and confirm the session remains active.
- Wrong password and duplicate registration show errors without crashing.
- Logged-out `/account` and `/checkout` redirect to login.
- Add a cart item, open checkout, log in; confirm return to checkout and cart retained.
- A customer opening `/admin` is redirected to `/account`.
- Promote your own account; verify `/admin` is accessible after login.
- Log out; protected pages must require login again.
- Check the header and forms on mobile and desktop.
- Run `npm run lint`, `npm test` and `npm run build`.

Automated checks cover safe redirect destinations plus the existing domain tests.
A live database-backed login, migration and cookie flow must also be checked in
your configured environment; a production build alone does not prove those flows.

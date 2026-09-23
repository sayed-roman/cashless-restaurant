# Table reservations

## Setup

Stop the development server, run npm run db:migrate and npm run db:generate,
then restart npm run dev. No new dependencies or environment variables are needed.
Apply migrations on the hosted database before deploying the new code.

## Behavior

Signed-in guests submit the existing homepage form. The server validates their
session, name, phone, real calendar date, one of the seven offered time slots,
1–8 guests, future time and a 90-day booking window. Times use Asia/Dhaka (UTC+06).
A reservation is stored with PENDING status. This is a request awaiting restaurant
confirmation, not an automatic table allocation.

My Reservations is available from Account and /reservations; every query filters
by the authenticated user's ID. Each page displays 20 reservations. Admin can see
all bookings at /admin/reservations and change their statuses. User/account data
comes from the session, never submitted form fields.

Transitions: pending → confirmed (future only) or cancelled; confirmed → cancelled
or completed (after scheduled time). Closed bookings cannot be reopened.
Conditional updates prevent simultaneous status changes from overwriting each other.
There is no table inventory or automatic capacity scheduling; admins confirm based
on real availability. Email/SMS notifications and customer editing/cancellation are
not included.

A unique user/time constraint prevents duplicate bookings, including retry races.
A cancelled booking still occupies that user's same timestamp; choose another time
or contact the restaurant. Reference IDs let staff locate bookings. No payment is
required for reservations.

## Manual checks

1. Book as customer A and verify a reference plus PENDING status in My Reservations.
2. Refresh; the booking must persist.
3. Sign in as customer B; A's bookings must not appear.
4. Log out and attempt booking; authentication must be required on the server.
5. As admin, open Reservations, confirm A's request, and refresh A's list to see CONFIRMED.
6. Cancel a test booking; closed bookings must offer no additional transitions.
7. Retry an identical date/time for A; no duplicate row should appear.
8. Test invalid dates, past times and guest counts.
9. Review mobile layout and pagination.
10. Run npm run lint, npm test and npm run build.

Automated tests cover validation, timezone conversion and transition rules.
Live database isolation, migrations and booking flows still need the checks above.
Image upload is on hold and is not required by this increment.

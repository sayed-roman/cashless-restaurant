# Stripe sandbox payments

Apply this follow-up after stripe-payments.patch. No new schema migration or dependency is required.

The server creates the Checkout Session using the persisted order total. Webhooks validate the raw-body signature (including a five-minute timestamp tolerance), then check session ID, order metadata, currency and amount before updating payment status. Repeated events cannot downgrade PAID or REFUNDED. Processing failures return 500 for delivery retry; malformed signatures return 400.

The return page checks the signed-in user's own order in the database. Until a webhook confirms payment it displays pending, not success. Refresh after webhook delivery. Cart contents are kept during payment; a confirmed return clears only the exact cart captured for that order.

My Orders and Admin Orders display payment status separately from preparation status. Continue payment resumes the existing open Stripe session, avoiding another order for that action. Closed sessions show a message; this version does not automatically create replacement sessions. Refund automation is not implemented.

PowerShell listener:

```powershell
stripe listen --events "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired" --forward-to "http://localhost:3000/api/payments/webhook"
```

Use the listener's webhook secret in .env. Restart the application after changing it. Keep both listener and application running.

Checks:
- Successful sandbox payment: webhook 200, database PAID, own return page confirmed.
- Cancel checkout: cart remains; Continue payment opens the same session.
- Delayed notification: return page stays pending until confirmation arrives.
- Another user cannot view a session's return page or resume its payment.
- Duplicate valid payment notifications leave paidAt unchanged.
- Wrong amount/currency or unmatched session: no PAID write; webhook returns 500 for investigation/retry.
- Invalid/stale signature: webhook 400.

Run npm test, npm run db:generate and npm run build before committing. This is sandbox functionality; a successful build does not replace the end-to-end payment test.

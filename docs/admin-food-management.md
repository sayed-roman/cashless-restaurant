# Admin food management

The admin dashboard now lists all foods, including unavailable ones, and provides
create, update and permanent delete actions. Search and category filters help locate
foods. Dashboard counts reflect real food records; no order or reservation statistics
are shown until those features exist.

## Architecture

- `src/app/admin/page.tsx`: server-rendered page.
- `src/components/admin/`: interactive form/table with scoped styles.
- `src/app/admin/actions.ts`: Server Action entry point and path revalidation.
- `src/server/admin/foods.ts`: database operations and fresh admin authorization.
- `src/lib/food-validation.ts`: server-enforced input validation.
- `tests/food-validation.test.mjs`: validation boundary tests.

Both reads and mutations call requireAdmin. Next.js Server Actions supply same-origin
request protections. The browser cannot grant roles or set the currency through the
food form. Prices are stored as integer minor units (BDT). A duplicate slug produces
a recoverable error. Deleting a food requires explicit confirmation in the UI.
If linked records prevent deletion, mark the food unavailable instead.

Images currently accept existing /images/ paths or HTTPS image URLs. This does not
upload files. Use an image URL you control and check it loads before saving.
MenuProvider reloads after successful admin changes in the current tab. Customers
with an already open page see changes after refreshing; this is not live push.

## Setup and review

No new dependencies, environment variables or migrations are required.

1. Log in with a promoted admin account and open /admin.
2. Add a temporary dish and verify its details and price in the public menu.
3. Edit it and verify the updated price and description.
4. Uncheck availability; it must disappear from the public menu while remaining in admin.
5. Try a duplicate slug and an invalid price; errors must appear without saving.
6. Cancel deletion and confirm the dish remains. Then confirm deletion and verify removal.
7. In a separate browser session, a customer must not be able to open /admin.
8. Test mobile table scrolling, form controls, and keyboard focus.
9. Run npm run lint, npm test and npm run build before committing.

Local automated checks do not replace reviewing these flows against your Neon database.
Orders, persisted reservations, payment processing and their admin screens remain separate increments.

# Database menu increment

GET /api/menu/ returns available BDT foods ordered by sortOrder then slug.
The route delegates database reads and DTO mapping to src/server/menu/queries.ts.
Only display fields are returned. Integer minor-unit prices are converted to BDT
at this boundary. No database connection string enters browser code.

MenuProvider requests the catalog once per mount and shares it with ProductGrid,
PopularDishes and CartProvider. Requests have a 15-second timeout and a retry UI.
The successful card markup, CSS and image paths are unchanged. Failed queries
return 503 with a generic message, never fallback food fixtures.

Dish pages query PostgreSQL at request time. Missing/unavailable items return 404.
New database slugs work without generating pages or rebuilding the application.
The existing src/data/menu.ts remains the seed source and contains shared types,
formatting and categories; its dishes array no longer supplies orderable cards.
Hero and category showcase photography remain editorial content.

## Verify against your development database

1. Run npm run dev and open /api/menu/: expect six dishes after seeding.
2. Check home popular dishes, Order Online, /menu/ filters and a dish page.
3. Add a food to cart and compare its displayed price and total with its detail page.
4. In Prisma Studio temporarily change one food priceMinor, then reload the site.
   Cards, details and cart should use the new price. Restore the original value.
5. Temporarily mark a food available=false. Reload: it should disappear from lists,
   and its direct detail URL should return 404. Restore availability afterward.
6. Test a nonexistent slug for 404; choose a category without foods for empty state.
7. In browser DevTools block /api/menu/, reload and confirm the error UI; unblock
   the request and click Try again. Use network throttling to check loading state.
8. Review desktop/mobile appearance and carousel motion after loading.

Checkout is still explicitly a demo. Authentication, persisted orders, server-side
price verification at checkout and Stripe payment remain separate increments.
Catalog data is refreshed on a full reload or retry, not by real-time subscription.
No database migration or dependency installation is needed for this increment.

# Backend foundation

This is the first backend increment, not a completed backend.
The existing UI still reads src/data/menu.ts. Database-driven pages,
authentication, orders, Stripe and reservations follow in separate changes.

## Responsibilities

- src/app: routes, layouts and request entry points.
- src/components: presentation and browser interactions.
- src/server: server-only database access and upcoming business rules.
- prisma/schema.prisma: database models.
- prisma/migrations: versioned SQL changes; commit these files.
- prisma/seed.ts: initial menu import without overwriting admin edits.
- src/data/menu.ts: existing menu and initial seed source.

Keep authorization and validation on the server. Never import database clients
into client components. Add feature modules when implemented, not empty folders.

## Local setup

Use Node >=22.18.0. Run npm ci, then copy .env.example to .env.
Set DATABASE_URL to a dedicated PostgreSQL database connection string.
Use the provider's required TLS settings. Do not disable certificate validation.

Run:

    npm run db:generate
    npm run db:migrate
    npm run db:seed
    npm run db:studio

Studio should show six Food records. Run the seed again: there should still be
six records, with existing values unchanged. Close Studio when finished.

    npm run lint
    npm test
    npm run build
    npm run dev

## Data decisions

Prices are integer minor units (220 BDT is 22000), avoiding floating-point totals.
Category is an enum; slug is unique; availability supports hiding unavailable food.
Orders will store purchase-time price snapshots rather than rely on current prices.
User/session models will be added with the chosen authentication library.

## Deployment

Static export is removed: deploy to a Node-compatible Next.js host.
The old exported out directory is not the deployment target for the backend.
Configure DATABASE_URL in the host environment. Run migrations once per release,
then generate/build. Do not run migrations or seed on each web request.
Never run database resets on a database containing real orders.

# Cashless Restaurant

Cashless Restaurant is a production-oriented restaurant platform built with **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL**, **Better Auth**, and **Stripe Checkout**.

It combines customer ordering, authenticated table reservations, online payments, and a role-protected restaurant administration panel.

## Live Demo

- **Production:** https://cashless-restaurant-i8iq.vercel.app
- **Repository:** https://github.com/sayed-roman/cashless-restaurant

## Features

### Customer experience

- Responsive menu with categories and detailed dish pages
- Registration, login, logout, sessions, and protected routes
- Customer dashboard with order and reservation summaries
- Cart quantity management with server-side validation
- Persistent food orders stored in PostgreSQL
- Stripe Checkout with success, cancellation, retry, and webhook confirmation
- Order history with payment and fulfilment status
- Authenticated table reservations with date, time, guest, and phone validation
- Reservation history with status visibility

### Administration

- Server-enforced administrator role
- Overview of menu, orders, and reservations
- Food management: add, edit, availability updates, and safe deletion rules
- Order management with status and payment visibility
- Reservation management with controlled status transitions
- Ordered dishes are protected from unsafe hard deletion; administrators can mark them unavailable instead

## Technical Highlights

- **Next.js App Router** with server-rendered pages, server actions, and API handlers
- **TypeScript** across UI, validation, and server layers
- **Prisma ORM** with versioned PostgreSQL migrations
- **Better Auth** for credential authentication and database-backed sessions
- **Stripe Checkout** with webhook signature verification and idempotent payment updates
- Server-side ownership and role checks; client input is never trusted for identity, price, or permissions
- Separate validation, database query, and business service modules
- Automated tests for carts, orders, reservations, redirects, and payments

## Architecture

```text
src/
├── app/                 # Routes, pages, layouts, actions, and API handlers
├── components/          # Reusable UI and feature components
├── lib/                 # Shared utilities and validation helpers
├── server/              # Database queries and business services
└── data/                # Shared domain data

prisma/
├── schema.prisma        # Relational database schema
└── migrations/          # Versioned migrations

scripts/                 # Operational scripts, including admin promotion
tests/                   # Automated domain and workflow tests
```

The API layer stays thin. Authorization and parsing happen at the boundary, while reusable business rules live in server services and validation modules.

## Data Model

```text
User ──< Reservations
User ──< Orders ──< OrderItems >── Food
```

Order items preserve food name and price snapshots so historical orders remain accurate after menu changes.

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Styling | CSS Modules and reusable design components |
| Authentication | Better Auth |
| ORM | Prisma |
| Database | PostgreSQL on Neon |
| Payments | Stripe Checkout and webhooks |
| Testing | Node.js test runner |
| Deployment | Vercel |

## Requirements

- Node.js `22.18+`
- npm
- PostgreSQL database
- Stripe Sandbox account for payment testing

## Local Setup

```bash
git clone https://github.com/your-username/cashless-restaurant.git
cd cashless-restaurant
npm ci
```

Create a `.env` file in the project root:

```env
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="a-random-secret-at-least-32-characters-long"
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

The committed `.env.example` contains placeholders only. Never commit `.env` or real credentials.

## Database Commands

```bash
npm run db:generate
npm run db:migrate
npx prisma migrate dev --name migration_name
npm run db:studio
```

For a deployed database:

```bash
npx prisma migrate deploy
```

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe Webhooks

Local development:

```bash
stripe listen --events "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired" --forward-to "http://localhost:3000/api/payments/webhook"
```

Production endpoint:

```text
https://cashless-restaurant-i8iq.vercel.app/api/payments/webhook
```

The production signing secret is stored in Vercel as `STRIPE_WEBHOOK_SECRET`.

## Administrator Setup

Register a normal account, then promote it:

```bash
npm run admin:promote -- your-email@example.com
```

After signing in again, the administrator can access `/admin`.

## Quality Checks

```bash
npm test
npm run build
git status
```

Before deployment, tests should pass, the production build should succeed, and the working tree should be clean.

## Deployment

The application runs on Vercel with Neon PostgreSQL. Configure these Production variables:

```env
DATABASE_URL
BETTER_AUTH_URL
BETTER_AUTH_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

Apply production migrations with `npx prisma migrate deploy`, configure the Stripe webhook, and redeploy after environment variable changes.

## Security Decisions

- `.env` is ignored by Git and secrets stay outside source control.
- Admin authorization is enforced on the server.
- User ownership comes from the authenticated session.
- Client-submitted prices, roles, currencies, and totals are not trusted.
- Stripe signatures, ownership, amounts, and currencies are verified.
- Webhook processing is idempotent.
- Orders preserve immutable price and food-name snapshots.
- Food items connected to orders are not hard-deleted; availability safely hides them.
- Loading, error, empty, and unavailable states are implemented for resilient UX.

## Project Status

Authentication, menu management, ordering, reservations, Stripe Sandbox payments, customer dashboards, admin operations, and Vercel deployment are implemented end to end.



## Purpose

This project was built as a software engineering assessment and portfolio piece, demonstrating production-level architecture, authentication, payments, and role-based access control.

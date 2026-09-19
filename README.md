# Cashless Restaurant

A restaurant website built with Next.js App Router, TypeScript and Tailwind CSS.

## Development

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Agreed scope

Hero image slideshow (3 seconds), manually controlled popular dishes carousel, About Us, photographic menu categories, product ordering, checkout and reservation demo. Cream, forest green and muted gold visual identity. Mobile and keyboard support.

Order and reservation submission are demonstrations; no payment is taken or real booking made. Production requires server-side validation, order storage, availability checks and a payment provider.

Features are developed as separate meaningful Git commits. GitHub publication is pending account connection.

## Architecture

- `src/app/`: server-rendered route composition and statically generated dish pages.
- `src/components/home/`: focused homepage sections; slider and carousel isolate their interactive state.
- `src/components/menu/`: category filters and reusable product display.
- `src/components/cart/`: cart provider and native modal drawer.
- `src/components/forms/`: checkout and reservation interactions.
- `src/data/menu.ts`: typed menu data shared by menu, details, cart and checkout.
- `src/lib/`: cart reducer and validation helpers.
- `tests/`: business-rule checks for quantities, dates and phone input.

Cart state persists through in-app navigation; refreshing clears it. No personal form data is saved. The static export is generated in `out/`; the same Next.js project can be deployed on Vercel. Native dialogs provide Escape handling and modal focus containment. Motion respects the visitor's reduced-motion preference.

## Images and content

Photographs are downloaded Unsplash assets. Original source links are recorded in `public/images/sources.json`. Dish descriptions, prices and allergen information are sample content; verify them with the restaurant before production use. Opening hours and exact contact details are intentionally pending.

## Status

Production build, lint, TypeScript and domain tests are checked locally. Browser interaction/visual QA is pending because this environment's preview adapter does not support the Next.js development server. GitHub integration was connected by the user, but its callable operations were not yet exposed to this session.

# Admin workspace

/admin is now Overview. /admin/menu contains the existing food manager.
The shared admin layout has desktop sidebar navigation, an active page indicator,
a compact top bar, website link and logout. Mobile uses a native modal dialog
drawer with Escape support and browser focus containment.

Admin layout checks requireAdmin. Both pages independently call the protected
food query; mutations continue to authorize independently in the server layer.
PublicChrome hides the public header/footer/cart UI on admin routes; this is a
presentation decision, not an authorization boundary. Global cart/menu providers
stay mounted when navigating between the site and admin.

Only implemented destinations appear. Orders and Reservations will be added when
their backend and screens are ready. Image upload is not part of this patch.
No new dependencies, environment variables or migrations are required.

Review:
- /admin shows actual menu totals and Manage menu link.
- Menu Management opens /admin/menu with existing CRUD behavior.
- Saving availability updates the menu and overview totals.
- View website restores the restaurant header/footer.
- Mobile menu opens, closes on navigation and Escape, and keyboard focus stays inside.
- Logout returns to the website; refresh on admin requires login.
- A customer cannot access either admin route.

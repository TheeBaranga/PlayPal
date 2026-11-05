# PlayPal

A static website with a toy catalogue, three browser games, colouring downloads, craft instructions and demo workshop bookings.

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm start
```

Open http://localhost:3000. Use an HTTP server because Activities uses JavaScript modules. Set `PORT` to change the default port. No dependencies need installing.

## Checks

```sh
npm test
```

Checks cover local HTML links, activity assets, PDF signatures, and Memory Match resets, shared routes, header/footer integration, and duplicate bootstrap protection.

## Structure

- `modules/index.html`: Home; `modules/toy-shop/toy-shop.html`, `modules/games/games.html`, and `modules/activities/activities.html`: section pages.
- `index.html` and `games.html`: compatibility redirects that preserve query strings and fragments.
- `js/header-footer.js`: the single header/footer implementation, navigation definitions, and control bindings.
- `css/header-footer.css`: sticky header and footer-at-bottom page layout, inheriting theme tokens and typography.
- `js/components.js`: routes, icons, storage and other shared primitives; `js/main.js`: one-time page bootstrap.
- `css/theme.css`: shared tokens, local fonts and base styles; `css/components.css`: generic reusable UI.
- `modules/activities/`: activity data, rendering and demo booking service.
- `modules/games/`: reusable games module and standalone demo.
- `assets/downloads/colouring/`: printable A4 colouring PDFs.
- `photos/`: catalogue photography.

The shop is a sample catalogue without checkout. Workshop bookings display demo feedback and do not reserve places or take payment.

## Reusing the header and footer

Every full page uses `<body class="pp-site">`, one `<div data-component="nav"></div>`, a main element with a unique ID, and one `<div data-component="footer"></div>`. The shared header generates the skip link and infers the active menu item from the current URL. Pages contain only their own content.

Load CSS in this order: `theme.css`, `components.css`, `header-footer.css`, then the screen stylesheet. Load scripts in this order: `components.js`, `header-footer.js`, `main.js`, then the screen script. Use paths relative to the page's directory.

Change navigation in `js/header-footer.js` and destinations in `PlayPal.routes` in `js/components.js`. The main menu and footer Explore links reuse the same navigation list. Missing destinations render unavailable controls instead of broken links.

The header stays at the top while scrolling. The footer sits at the viewport bottom on short pages and follows the content on long pages; it never covers content. A single ResizeObserver tracks header height for anchor/focus scrolling and toast placement. Header/footer bindings and the bootstrap run once per page.

### Header/footer responsiveness

The desktop shell follows the 1440px Figma proportions: an 88px header and four equal footer columns. Below 1200px, the main links occupy a second header row. Below 768px, all four section links remain visible and the Search button opens a full-width input; Escape closes it and restores focus. Footer groups reflow into touch-friendly columns. At 1800px and above, shell text increases modestly within a capped 1680px container. Icons are local Figma SVGs that inherit active and dark-mode colours through CSS masks.

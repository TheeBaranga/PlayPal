# Games module (Elvis)

Tic-Tac-Toe, Memory Match, Word Scramble. Plain HTML/CSS/JS, no libraries.

## Files
- `games.html`          - standalone page, open it to test the games on their own
- `games-fragment.html` - just the markup block (`<div class="games-module" id="games-root">`) to paste into the real Games page
- `games.css`           - all styling, scoped under `.games-module`, every class starts with `gm-`
- `games.js`            - all logic, only touches things inside `#games-root`

## Integrating into PlayPal
1. Paste the block from `games-fragment.html` where the Games page content goes.
2. Link the files on that page:
   - `<link rel="stylesheet" href="modules/games/games.css">`
   - `<script src="modules/games/games.js"></script>`   (put it AFTER the markup, or add `defer`)
   (adjust the paths if the page isn't at the project root)
3. If the page is injected dynamically by main.js (SPA style), call the script after the markup is in the DOM.
   `games.js` looks for `#games-root` and quietly does nothing if it isn't there.

## Theming
Colours live in CSS variables at the top of `games.css` (`--gm-pink`, `--gm-blue`, `--gm-purple`, ...).
To match `css/theme.css`, point them at the theme's variables, e.g. `--gm-purple: var(--primary);`

## Images
`assets/images/games/` is reserved for the games images (e.g. the games-preview for the home page).

# Games module

Tic-Tac-Toe, Memory Match and Word Scramble on one page. Plain HTML, CSS and ES modules, no libraries.

## Files
- `games.html`: page structure only (menu + the three game containers). Uses the shared header/footer.
- `games.css`: game styles only. Every class starts with `games-`. Colours/type/radii come from `css/theme.css`; buttons and tags use the shared `pp-btn` / `pp-tag`.
- `games.js`: entry point. Switches games (menu + arrow keys), starts the three games, opens `?game=tic-tac-toe|memory-match|word-scramble`.
- `tic-tac-toe.js`: `initTicTacToe(container)`: turns, computer opponent (minimax), difficulty, undo, reset.
- `memory-match.js`: `initMemoryMatch(container)`: cards, matching, move counter, reset.
- `word-scramble.js`: `initWordScramble(container)`: word bank, hints, scoring, validation, progress.
- `games-utils.js`: `shuffle`, `scoped`, `claim` (blocks double init), `setStatus`.

## Running it
ES modules need a web server (opening the file by double-click will not work):
`npm start`, then open http://localhost:3000/modules/games/games.html

## Page contract
`<body class="pp-site">`, one `<div data-component="nav">`, `<main id="main-content">`, one `<div data-component="footer">`,
CSS in the order theme, components, header-footer, games; classic shared scripts (`components.js`, `header-footer.js`, `main.js`),
then `<script type="module" src="games.js">`.

## Images
`assets/images/games/` is reserved for games images.

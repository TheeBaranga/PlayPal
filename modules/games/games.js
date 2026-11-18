/* PlayPal – Games page entry point.
   Switches between the three games (menu + arrow keys), starts each game
   module and opens the game requested by a ?game=... link from the Home page. */
import { claim } from './games-utils.js';
import { initTicTacToe } from './tic-tac-toe.js';
import { initMemoryMatch } from './memory-match.js';
import { initWordScramble } from './word-scramble.js';

const GAME_TABS = {
  'tic-tac-toe': 'tab-ttt',
  'memory-match': 'tab-mem',
  'word-scramble': 'tab-scr'
};

function initGames() {
  const root = document.getElementById('games-root');
  if (!root || !claim(root)) return;   // not the Games page, or already started

  const tabs = [...root.querySelectorAll('[role="tab"]')];

  function showTab(selected) {
    tabs.forEach(tab => {
      const isSelected = tab === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      root.querySelector('#' + tab.getAttribute('aria-controls')).hidden = !isSelected;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showTab(tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const step = event.key === 'ArrowRight' ? 1 : tabs.length - 1;
      const next = tabs[(i + step) % tabs.length];
      next.focus();
      showTab(next);
    });
  });

  initTicTacToe(root.querySelector('#game-ttt'));
  initMemoryMatch(root.querySelector('#game-mem'));
  initWordScramble(root.querySelector('#game-scr'));

  // Home-page links such as games.html?game=memory-match open that game directly.
  const requested = GAME_TABS[new URLSearchParams(window.location.search).get('game')];
  if (requested) showTab(root.querySelector('#' + requested));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGames, { once: true });
else initGames();

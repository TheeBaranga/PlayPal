/* PlayPal – Games: Memory Match (card generation, shuffling, matching, move counter, reset). */
import { claim, scoped, setStatus, shuffle } from './games-utils.js';

const EMOJI = ['🧸', '🚗', '🪁', '🎨', '🧩', '🚀', '🪀', '🎲', '🦖', '🎈'];
const MISMATCH_DELAY_MS = 800;

export function initMemoryMatch(container) {
  if (!claim(container)) return;
  const $ = scoped(container);
  const boardEl = $('#mem-board');
  const statusEl = $('#mem-status');
  const sizeEl = $('#mem-size');
  const movesEl = $('#mem-moves');
  const pairsEl = $('#mem-pairs');
  const resetBtn = $('#mem-reset');

  let first = null;      // the first card of the pair being turned
  let locked = false;    // true while a mismatched pair is showing
  let moves = 0;
  let pairsFound = 0;
  let totalPairs = 0;
  let mismatchTimer = null;

  function reset() {
    // A pending "turn the cards back" from the old board must not touch the new one.
    clearTimeout(mismatchTimer);
    mismatchTimer = null;
    totalPairs = Number(sizeEl.value);
    first = null;
    locked = false;
    moves = 0;
    pairsFound = 0;
    movesEl.textContent = 0;
    pairsEl.textContent = '0 / ' + totalPairs;
    setStatus(statusEl, 'Tap a card to flip it. Find all the pairs!');
    const columns = totalPairs === 10 ? 5 : 4;
    boardEl.style.gridTemplateColumns = `repeat(${columns},1fr)`;
    boardEl.innerHTML = '';
    shuffle([...EMOJI.slice(0, totalPairs), ...EMOJI.slice(0, totalPairs)]).forEach((emoji, i) => {
      const card = document.createElement('button');
      card.className = 'games-memory-card';
      card.dataset.e = emoji;
      card.textContent = '?';
      card.setAttribute('aria-label', `Card ${i + 1}, face down`);
      card.addEventListener('click', () => flip(card, i));
      boardEl.appendChild(card);
    });
  }

  function show(card, i) {
    card.classList.add('games-memory-card--open');
    card.textContent = card.dataset.e;
    card.setAttribute('aria-label', `Card ${i + 1}, ${card.dataset.e}`);
  }

  function hide(card, i) {
    card.classList.remove('games-memory-card--open');
    card.textContent = '?';
    card.setAttribute('aria-label', `Card ${i + 1}, face down`);
  }

  function flip(card, i) {
    if (locked || card.classList.contains('games-memory-card--open') || card.classList.contains('games-memory-card--done')) return;
    show(card, i);
    if (!first) { first = { card, i }; return; }

    moves++;
    movesEl.textContent = moves;
    const previous = first;
    first = null;
    locked = true;

    if (previous.card.dataset.e === card.dataset.e) {
      [previous.card, card].forEach(matched => {
        matched.classList.add('games-memory-card--done');
        matched.disabled = true;
        matched.setAttribute('aria-label', matched.dataset.e + ', matched');
      });
      pairsFound++;
      pairsEl.textContent = pairsFound + ' / ' + totalPairs;
      locked = false;
      if (pairsFound === totalPairs) setStatus(statusEl, `You found them all in ${moves} moves! 🎉`, 'good');
      else setStatus(statusEl, 'Match! ✅', 'good');
    } else {
      setStatus(statusEl, 'Not a match. Try again!', 'bad');
      mismatchTimer = setTimeout(() => {
        hide(previous.card, previous.i);
        hide(card, i);
        locked = false;
        mismatchTimer = null;
      }, MISMATCH_DELAY_MS);
    }
  }

  resetBtn.addEventListener('click', reset);
  sizeEl.addEventListener('change', reset);
  reset();
}

/* PlayPal – Games: small helpers shared by the three games.
   No game logic lives here. */

/** Fisher–Yates shuffle. Shuffles the array in place and returns it. */
export function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Returns a query function that only searches inside one game container. */
export function scoped(container) {
  return selector => container.querySelector(selector);
}

/**
 * Guards against initialising the same container twice (which would attach
 * every event listener twice). True the first time, false afterwards.
 */
export function claim(container) {
  if (container.dataset.gamesReady === 'true') return false;
  container.dataset.gamesReady = 'true';
  return true;
}

/** Writes a message into a status element. tone is '' (neutral), 'good' or 'bad'. */
export function setStatus(element, message, tone = '') {
  element.textContent = message;
  element.classList.remove('games-status--good');
  element.classList.remove('games-status--bad');
  if (tone) element.classList.add(`games-status--${tone}`);
}

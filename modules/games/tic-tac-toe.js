/* PlayPal – Games: Tic-Tac-Toe (turns, computer opponent, minimax, difficulty, undo, reset). */
import { claim, scoped, setStatus } from './games-utils.js';

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const COMPUTER_DELAY_MS = 450;

/** Returns {w:'X'|'O', line} for a win, {w:'draw'} for a full board, otherwise null. */
function winnerOf(cells) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return { w: cells[a], line };
  }
  return cells.every(Boolean) ? { w: 'draw' } : null;
}

/** Scores a position for the computer (O): +1 win, -1 loss, 0 draw. */
function minimax(cells, isComputerTurn) {
  const result = winnerOf(cells);
  if (result) return result.w === 'O' ? 1 : result.w === 'X' ? -1 : 0;
  let best = isComputerTurn ? -2 : 2;
  for (let i = 0; i < 9; i++) {
    if (cells[i]) continue;
    cells[i] = isComputerTurn ? 'O' : 'X';
    const score = minimax(cells, !isComputerTurn);
    cells[i] = null;
    best = isComputerTurn ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

/** Picks the computer's square. Easy: sometimes wins/blocks, otherwise random. Hard: minimax. */
function pickComputerMove(cells, level) {
  const empty = cells.map((value, i) => (value ? null : i)).filter(i => i !== null);
  if (level === 'easy') {
    if (Math.random() < 0.35) {
      for (const player of ['O', 'X']) {
        for (const i of empty) {
          cells[i] = player;
          const result = winnerOf(cells);
          cells[i] = null;
          if (result && result.w === player) return i;
        }
      }
    }
    return empty[Math.floor(Math.random() * empty.length)];
  }
  let bestScore = -2;
  let moves = [];
  for (const i of empty) {
    cells[i] = 'O';
    const score = minimax(cells, false);
    cells[i] = null;
    if (score > bestScore) { bestScore = score; moves = [i]; }
    else if (score === bestScore) moves.push(i);
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

export function initTicTacToe(container) {
  if (!claim(container)) return;
  const $ = scoped(container);
  const boardEl = $('#ttt-board');
  const statusEl = $('#ttt-status');
  const modeEl = $('#ttt-mode');
  const levelEl = $('#ttt-level');
  const undoBtn = $('#ttt-undo');
  const resetBtn = $('#ttt-reset');

  let board, turn, over, history;
  let busy = false;
  let computerTimer = null;
  const buttons = [];

  const vsComputer = () => modeEl.value === 'cpu';

  for (let i = 0; i < 9; i++) {
    const button = document.createElement('button');
    button.className = 'games-cell';
    button.addEventListener('click', () => play(i));
    boardEl.appendChild(button);
    buttons.push(button);
  }

  function cellLabel(i) {
    return `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${board[i] ? board[i] : 'empty'}`;
  }

  function render() {
    const result = winnerOf(board);
    buttons.forEach((button, i) => {
      button.textContent = board[i] || '';
      button.className = 'games-cell' + (board[i] ? ` games-cell--${board[i].toLowerCase()}` : '');
      button.disabled = over || !!board[i] || busy;
      button.setAttribute('aria-label', cellLabel(i));
      if (result && result.line && result.line.includes(i)) button.classList.add('games-cell--win');
    });
    undoBtn.disabled = history.length === 0 || busy;
  }

  function reset() {
    clearTimeout(computerTimer);
    computerTimer = null;
    busy = false;
    board = Array(9).fill(null);
    turn = 'X';
    over = false;
    history = [];
    levelEl.disabled = !vsComputer();
    setStatus(statusEl, vsComputer() ? 'Your turn! You are X.' : 'X goes first.');
    render();
  }

  /** Ends the game if someone has won or the board is full. */
  function finish() {
    const result = winnerOf(board);
    if (!result) return false;
    over = true;
    if (result.w === 'draw') setStatus(statusEl, "It's a draw! 🤝");
    else if (vsComputer()) {
      setStatus(statusEl, result.w === 'X' ? 'You win! 🎉' : 'The computer wins. Try again!', result.w === 'X' ? 'good' : 'bad');
    } else setStatus(statusEl, `${result.w} wins! 🎉`, 'good');
    render();
    return true;
  }

  function play(i) {
    if (over || board[i] || busy) return;
    board[i] = turn;
    history.push(i);
    if (finish()) return;
    turn = turn === 'X' ? 'O' : 'X';
    if (vsComputer() && turn === 'O') {
      busy = true;
      setStatus(statusEl, 'Computer is thinking…');
      render();
      computerTimer = setTimeout(() => {
        computerTimer = null;
        busy = false;
        const move = pickComputerMove(board, levelEl.value);
        board[move] = 'O';
        history.push(move);
        if (finish()) return;
        turn = 'X';
        setStatus(statusEl, 'Your turn!');
        render();
      }, COMPUTER_DELAY_MS);
    } else {
      setStatus(statusEl, vsComputer() ? 'Your turn!' : `${turn}'s turn.`);
      render();
    }
  }

  function undo() {
    if (busy || !history.length) return;
    // Against the computer, take back the computer's reply as well as your own move.
    const moves = vsComputer() ? (history.length % 2 === 0 ? 2 : 1) : 1;
    for (let k = 0; k < moves && history.length; k++) board[history.pop()] = null;
    over = false;
    turn = history.length % 2 === 0 ? 'X' : 'O';
    setStatus(statusEl, 'Move taken back. ' + (vsComputer() ? 'Your turn!' : `${turn}'s turn.`));
    render();
  }

  undoBtn.addEventListener('click', undo);
  resetBtn.addEventListener('click', reset);
  modeEl.addEventListener('change', reset);
  levelEl.addEventListener('change', reset);
  reset();
}

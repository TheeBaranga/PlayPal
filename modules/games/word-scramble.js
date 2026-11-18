/* PlayPal – Games: Word Scramble (word bank, scrambling, hints, scoring, validation, progress). */
import { claim, scoped, setStatus, shuffle } from './games-utils.js';

const WORDS = [
  ['TEDDY', 'A soft, cuddly bear you hug at bedtime'],
  ['PUZZLE', 'Fit the pieces together to see the picture'],
  ['ROBOT', 'A machine that beeps and moves like a person'],
  ['CRAYON', 'A waxy stick for colouring'],
  ['BALLOON', 'Floats up when filled with helium'],
  ['MARBLES', 'Little glass balls you roll and flick'],
  ['SCOOTER', 'Two wheels, a handle, and you push with one foot'],
  ['BLOCKS', 'Stack them up to build a tower'],
  ['KITE', 'Flies high on a string when it is windy'],
  ['DRUM', 'Bang bang! You hit it with sticks'],
  ['DOLL', 'A toy friend you can dress up'],
  ['PAINT', 'Brush it on paper to make colourful art']
];
const ROUNDS = 8;
const POINTS = 10;
const HINT_PENALTY = 5;

/** Shuffles a word's letters, making sure the result differs from the word when it can. */
function scramble(word) {
  let letters = word;
  for (let attempt = 0; attempt < 50 && letters === word; attempt++) {
    letters = shuffle(word.split('')).join('');
  }
  return letters;
}

export function initWordScramble(container) {
  if (!claim(container)) return;
  const $ = scoped(container);
  const playEl = $('#scr-play');
  const tilesEl = $('#scr-tiles');
  const clueEl = $('#scr-clue');
  const formEl = $('#scr-form');
  const inputEl = $('#scr-input');
  const statusEl = $('#scr-status');
  const progressTextEl = $('#scr-progress-text');
  const barEl = $('#scr-bar');
  const scoreEl = $('#scr-score');
  const hintBtn = $('#scr-hint');
  const skipBtn = $('#scr-skip');
  const resetBtn = $('#scr-reset');

  let questions, index, score, hintUsed, finished;

  function newGame() {
    questions = shuffle([...WORDS]).slice(0, ROUNDS);
    index = 0;
    score = 0;
    finished = false;
    playEl.hidden = false;
    setStatus(statusEl, '');
    showQuestion();
  }

  function showQuestion() {
    scoreEl.textContent = score;
    barEl.style.width = (index / ROUNDS * 100) + '%';
    if (index >= ROUNDS) { endGame(); return; }

    const [word, clue] = questions[index];
    hintUsed = false;
    progressTextEl.textContent = `Question ${index + 1} of ${ROUNDS}`;
    tilesEl.innerHTML = '';
    scramble(word).split('').forEach(letter => {
      const tile = document.createElement('div');
      tile.className = 'games-tile';
      tile.textContent = letter;
      tilesEl.appendChild(tile);
    });
    tilesEl.setAttribute('aria-label', 'Scrambled letters: ' + [...tilesEl.children].map(tile => tile.textContent).join(', '));
    clueEl.textContent = 'Clue: ' + clue;
    inputEl.value = '';
    inputEl.focus();
    hintBtn.disabled = false;
  }

  function endGame() {
    playEl.hidden = true;
    finished = true;
    progressTextEl.textContent = 'All done!';
    const verdict = score >= ROUNDS * 8 ? 'Word wizard! 🧙' : score >= ROUNDS * 5 ? 'Great job! 🌟' : 'Good try. Play again!';
    setStatus(statusEl, `Final score: ${score} out of ${ROUNDS * POINTS}. ${verdict}`, 'good');
  }

  function nextQuestion() {
    index++;
    showQuestion();
  }

  function checkAnswer(event) {
    event.preventDefault();
    if (finished) return;
    const guess = inputEl.value.trim().toUpperCase();
    const answer = questions[index][0];
    if (!guess) {
      setStatus(statusEl, 'Type your answer in the box first.', 'bad');
      inputEl.focus();
      return;
    }
    if (!/^[A-Z]+$/.test(guess)) {
      setStatus(statusEl, 'Letters only, please (A to Z).', 'bad');
      inputEl.focus();
      return;
    }
    if (guess === answer) {
      score += Math.max(POINTS - (hintUsed ? HINT_PENALTY : 0), HINT_PENALTY);
      setStatus(statusEl, 'Correct! 🎉', 'good');
      nextQuestion();
    } else {
      const sameLength = guess.length === answer.length;
      setStatus(statusEl, sameLength ? 'Close! Check the letters and try again.' : `Hmm, the word has ${answer.length} letters. Try again!`, 'bad');
      inputEl.select(); // keep what they typed so they can fix it
    }
  }

  function giveHint() {
    if (finished) return;
    hintUsed = true;
    const word = questions[index][0];
    setStatus(statusEl, `Hint: it starts with "${word[0]}" and has ${word.length} letters.`);
    hintBtn.disabled = true;
    inputEl.focus();
  }

  function skip() {
    if (finished) return;
    setStatus(statusEl, `Skipped. The word was ${questions[index][0]}.`);
    nextQuestion();
  }

  formEl.addEventListener('submit', checkAnswer);
  hintBtn.addEventListener('click', giveHint);
  skipBtn.addEventListener('click', skip);
  resetBtn.addEventListener('click', newGame);
  newGame();
}

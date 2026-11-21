// main.js — boots the game: wires the canvas, the HUD and the keyboard,
// shows the title screen, and applies a ?shot= stage when one is given.
import { SpotGame } from './game.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const hud = {
  levelName: document.getElementById('level-name'),
  levelTag: document.getElementById('level-tag'),
  found: document.getElementById('found-count'),
  timer: document.getElementById('timer'),
  timerFill: document.getElementById('timer-fill'),
  score: document.getElementById('score'),
  hints: document.getElementById('hints'),
  dots: document.getElementById('level-dots'),
  toast: document.getElementById('toast'),
};

const game = new SpotGame(canvas, hud);
window.spotGame = game; // handy for play-testing from the console

// The level dots in the header.
for (let i = 0; i < 5; i++) {
  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.textContent = i + 1;
  hud.dots.appendChild(dot);
}

function bindOverlayButtons() {
  const start = document.getElementById('btn-start');
  if (start) start.addEventListener('click', () => game.startGame());
  const next = document.getElementById('btn-next');
  if (next) next.addEventListener('click', () => game.nextLevel());
  const replay = document.getElementById('btn-replay');
  if (replay) replay.addEventListener('click', () => game.restartLevel());
  const retry = document.getElementById('btn-retry');
  if (retry) retry.addEventListener('click', () => game.restartLevel());
  const restart = document.getElementById('btn-restart');
  if (restart) restart.addEventListener('click', () => game.startGame());
  const again = document.getElementById('btn-again');
  if (again) again.addEventListener('click', () => game.playAgain());
}

// Overlay buttons are rebuilt whenever an overlay shows, so handle them by
// delegation on the overlay itself instead of binding each one.
document.getElementById('overlay').addEventListener('click', (e) => {
  if (e.target.id === 'btn-start') game.startGame();
  if (e.target.id === 'btn-next') game.nextLevel();
  if (e.target.id === 'btn-replay' || e.target.id === 'btn-retry') game.restartLevel();
  if (e.target.id === 'btn-restart' || e.target.id === 'btn-again') game.startGame();
});

canvas.addEventListener('click', (e) => game.onClick(e));

document.getElementById('btn-hint').addEventListener('click', () => game.useHint());
document.getElementById('btn-sound').addEventListener('click', (e) => {
  const muted = game.sfx.toggleMute();
  e.currentTarget.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
});
document.getElementById('btn-restart-level').addEventListener('click', () => {
  if (game.state === 'playing' || game.state === 'timeUp') game.restartLevel();
});

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (k === 'h') game.useHint();
  else if (k === 'r' && (game.state === 'playing' || game.state === 'timeUp')) game.restartLevel();
  else if (k === 'n' && game.state === 'levelDone') game.nextLevel();
  else if (k === 'm') {
    const muted = game.sfx.toggleMute();
    document.getElementById('btn-sound').textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
  } else if ((k === 'enter' || k === ' ') && game.state === 'start') {
    e.preventDefault();
    game.startGame();
  } else if (k === 'enter' && game.state === 'win') {
    game.playAgain();
  }
});

// A staged screenshot state wins over the title screen; otherwise show it.
const staged = applyShot(game, new URLSearchParams(location.search));
if (!staged) {
  game.loadLevel(0);
  game.state = 'start';
  game.timeLeft = game.level.seconds;
  game.setOverlay(game.startOverlay());
  game.updateHud();
}
bindOverlayButtons();

// Read the current state aloud for screen readers.
const status = document.getElementById('status');
setInterval(() => {
  if (game.state === 'playing') {
    status.textContent = `${game.scene.name}: ${game.found.size} of ${game.scene.differences.length} differences found, ${Math.ceil(game.timeLeft)} seconds left, score ${game.score}.`;
  }
}, 2000);

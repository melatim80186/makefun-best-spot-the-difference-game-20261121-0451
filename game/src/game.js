// game.js — the game itself: state, input, scoring, hints, timer, confetti.
// It owns the canvas, the HUD in the DOM, and the overlays. Scenes come from
// scenes.js, sounds from audio.js, numbers from config.js.

import {
  PANEL_W, PANEL_H, PANEL_GAP, CANVAS_W, CANVAS_H,
  LEVELS, FIND_POINTS, STREAK_BONUS, WRONG_PENALTY, HINT_COST,
  HINTS_PER_LEVEL, TIME_BONUS_PER_SECOND, PERFECT_LEVEL_BONUS,
  GAME_NAME, GAME_TITLE, GAME_SUBTITLE,
} from './config.js';
import { SoundFX } from './audio.js';
import { rr, circle, ellipse, poly, star, fillCircle, strokeCircle, text, line } from './draw.js';

const LEFT_X = 10;
const RIGHT_X = LEFT_X + PANEL_W + PANEL_GAP;
const PANEL_Y = 20;

const GOLD = '#f2b63a';
const RED = '#d9382a';

export class SpotGame {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud; // {levelName, levelTag, found, timer, timerFill, score, hints, dots, toast}
    this.sfx = new SoundFX();
    this.state = 'start'; // start | playing | levelDone | win | timeUp
    this.levelIndex = 0;
    this.found = new Set();
    this.markAnims = []; // {x, y, r, t}
    this.wrongMarks = []; // {x, y, t}
    this.hintPulse = null; // {x, y, r, until}
    this.score = 0;
    this.streak = 0;
    this.wrongThisLevel = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = LEVELS[0].seconds;
    this.lastTick = 0;
    this.shakeUntil = 0;
    this.confetti = [];
    this.paused = false;
    this.totalFound = 0;
    this.totalClicks = 0;
    this.levelStartScore = 0;
    this.lastWholeSecond = -1;
    this.levelStats = [];
    this.startedAt = 0;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    document.addEventListener('visibilitychange', () => {
      this.paused = document.hidden && this.state === 'playing';
    });
    this.lastFrame = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }

  get level() { return LEVELS[this.levelIndex]; }
  get scene() { return this.level.scene; }

  resizeCanvas() {
    const scale = Math.min(1, (window.innerWidth - 24) / CANVAS_W);
    this.canvas.style.width = `${Math.floor(CANVAS_W * scale)}px`;
    this.canvas.style.height = `${Math.floor(CANVAS_H * scale)}px`;
    this.viewScale = scale;
  }

  // -- flow ---------------------------------------------------------------
  startGame() {
    this.score = 0;
    this.totalFound = 0;
    this.totalClicks = 0;
    this.levelStats = [];
    this.startedAt = Date.now();
    this.loadLevel(0);
    this.setOverlay(null);
    this.sfx.ensure();
    this.sfx.click();
  }

  loadLevel(i) {
    this.levelIndex = i;
    this.found = new Set();
    this.markAnims = [];
    this.wrongMarks = [];
    this.hintPulse = null;
    this.streak = 0;
    this.wrongThisLevel = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = this.level.seconds;
    this.lastWholeSecond = Math.ceil(this.timeLeft);
    this.levelStartScore = this.score;
    this.state = 'playing';
    this.paused = false;
    this.updateHud();
    this.showToast(`${this.scene.name} — find ${this.scene.differences.length} differences!`);
  }

  nextLevel() {
    if (this.levelIndex + 1 >= LEVELS.length) return;
    this.sfx.click();
    this.loadLevel(this.levelIndex + 1);
    this.setOverlay(null);
  }

  restartLevel() {
    this.score = this.levelStartScore;
    this.sfx.click();
    this.loadLevel(this.levelIndex);
    this.setOverlay(null);
  }

  playAgain() {
    this.startGame();
  }

  // -- input --------------------------------------------------------------
  canvasPoint(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (CANVAS_W / rect.width);
    const y = (evt.clientY - rect.top) * (CANVAS_H / rect.height);
    return { x, y };
  }

  panelPoint(p) {
    if (p.y < PANEL_Y || p.y > PANEL_Y + PANEL_H) return null;
    if (p.x >= LEFT_X && p.x <= LEFT_X + PANEL_W) return { x: p.x - LEFT_X, y: p.y - PANEL_Y };
    if (p.x >= RIGHT_X && p.x <= RIGHT_X + PANEL_W) return { x: p.x - RIGHT_X, y: p.y - PANEL_Y };
    return null;
  }

  onClick(evt) {
    this.sfx.ensure();
    if (this.state !== 'playing' || this.paused) return;
    const p = this.canvasPoint(evt);
    const local = this.panelPoint(p);
    if (!local) return;
    this.totalClicks++;
    const hit = this.scene.differences.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = local.x - d.x;
      const dy = local.y - d.y;
      return dx * dx + dy * dy <= (d.r + 8) * (d.r + 8);
    });
    if (hit) this.registerFind(hit, p);
    else this.registerMiss(p, local);
  }

  registerFind(diff, canvasP) {
    this.found.add(diff.id);
    this.totalFound++;
    this.streak++;
    const gained = FIND_POINTS + (this.streak - 1) * STREAK_BONUS;
    this.score += gained;
    this.sfx.found();
    this.markAnims.push({ x: diff.x, y: diff.y, r: diff.r, t: 0 });
    this.showToast(`${diff.label} — +${gained}`, true);
    this.updateHud();
    if (this.found.size === this.scene.differences.length) this.completeLevel();
  }

  registerMiss(canvasP, local) {
    this.score = Math.max(0, this.score - WRONG_PENALTY);
    this.streak = 0;
    this.wrongThisLevel++;
    this.sfx.wrong();
    this.wrongMarks.push({ x: canvasP.x, y: canvasP.y, t: 0 });
    this.shakeUntil = performance.now() + 180;
    this.showToast('Nothing there — −25', false);
    this.updateHud();
  }

  useHint() {
    if (this.state !== 'playing' || this.paused) return;
    const remaining = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0 || this.hintsLeft <= 0) {
      this.showToast(this.hintsLeft <= 0 ? 'No hints left on this level' : 'Nothing left to hint', false);
      return;
    }
    this.hintsLeft--;
    this.score = Math.max(0, this.score - HINT_COST);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintPulse = { x: pick.x, y: pick.y, r: pick.r, until: performance.now() + 2500 };
    this.sfx.hint();
    this.showToast(`Hint: look near the ${pick.label.toLowerCase()} — −${HINT_COST}`, false);
    this.updateHud();
  }

  completeLevel() {
    const timeBonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    const perfect = this.wrongThisLevel === 0 ? PERFECT_LEVEL_BONUS : 0;
    this.score += timeBonus + perfect;
    this.levelStats.push({
      name: this.scene.name,
      timeLeft: Math.round(this.timeLeft),
      wrong: this.wrongThisLevel,
      bonus: timeBonus + perfect,
    });
    this.state = 'levelDone';
    this.sfx.levelClear();
    this.burstConfetti();
    this.updateHud();
    const last = this.levelIndex === LEVELS.length - 1;
    if (last) {
      this.state = 'win';
      this.sfx.win();
      this.burstConfetti();
      this.burstConfetti();
    }
    this.showEndOverlay(last, timeBonus, perfect);
  }

  timeOut() {
    this.state = 'timeUp';
    this.sfx.timeUp();
    this.showEndOverlay(false, 0, 0, true);
  }

  // -- confetti -------------------------------------------------------------
  burstConfetti() {
    const colors = ['#f2b63a', '#e84a6a', '#3a7ac9', '#5da24a', '#f2a541', '#c94a7a'];
    for (let i = 0; i < 90; i++) {
      this.confetti.push({
        x: Math.random() * CANVAS_W,
        y: -10 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 120,
        vy: 90 + Math.random() * 140,
        size: 4 + Math.random() * 6,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 8,
      });
    }
  }

  // -- HUD ------------------------------------------------------------------
  updateHud() {
    const { levelName, levelTag, found, timer, timerFill, score, hints, dots } = this.hud;
    levelName.textContent = `Level ${this.levelIndex + 1} — ${this.scene.name}`;
    levelTag.textContent = `${this.scene.difficulty} · ${this.scene.tagline}`;
    found.textContent = `${this.found.size} / ${this.scene.differences.length} found`;
    score.textContent = this.score.toLocaleString('en-US');
    hints.textContent = `💡 ${this.hintsLeft}`;
    dots.querySelectorAll('.dot').forEach((el, i) => {
      el.classList.toggle('done', i < this.levelIndex);
      el.classList.toggle('current', i === this.levelIndex);
    });
    this.updateTimerHud();
  }

  updateTimerHud() {
    const total = this.level.seconds;
    const secs = Math.max(0, Math.ceil(this.timeLeft));
    const mm = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    this.hud.timer.textContent = `${mm}:${ss}`;
    const pct = Math.max(0, (this.timeLeft / total) * 100);
    this.hud.timerFill.style.width = `${pct}%`;
    this.hud.timerFill.classList.toggle('low', this.timeLeft <= 15);
    this.hud.timer.classList.toggle('low', this.timeLeft <= 15);
  }

  showToast(msg, good) {
    const t = this.hud.toast;
    t.textContent = msg;
    t.classList.toggle('good', !!good);
    t.classList.toggle('bad', !good);
    t.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // -- overlays ---------------------------------------------------------------
  setOverlay(html) {
    const ov = document.getElementById('overlay');
    if (!html) { ov.classList.remove('show'); ov.innerHTML = ''; return; }
    ov.innerHTML = html;
    ov.classList.add('show');
  }

  startOverlay() {
    return `
      <div class="panel start-panel">
        <div class="eyebrow">${GAME_NAME}</div>
        <h1>${GAME_TITLE}</h1>
        <p class="sub">${GAME_SUBTITLE}</p>
        <div class="levels-preview">
          ${LEVELS.map((l, i) => `<span class="lvl-chip" style="--acc:${l.scene.accent}">${i + 1} · ${l.scene.name}</span>`).join('')}
        </div>
        <p class="how">Two pictures, side by side — almost the same. Click a difference on <b>either</b> picture to ring it. Find them all before the clock runs out.</p>
        <button class="big-btn" id="btn-start">▶ &nbsp;Start playing</button>
        <p class="keys"><kbd>H</kbd> hint &nbsp; <kbd>R</kbd> restart level &nbsp; <kbd>N</kbd> next level &nbsp; <kbd>M</kbd> sound</p>
      </div>`;
  }

  showEndOverlay(isWin, timeBonus, perfect, timedOut = false) {
    if (timedOut) {
      this.setOverlay(`
        <div class="panel">
          <div class="eyebrow">Out of time</div>
          <h2>Time's up!</h2>
          <p class="sub">You found ${this.found.size} of ${this.scene.differences.length} differences in ${this.scene.name}.</p>
          <p class="score-line">Score so far: <b>${this.score.toLocaleString('en-US')}</b></p>
          <div class="btn-row">
            <button class="big-btn" id="btn-retry">↻ &nbsp;Retry this level</button>
            <button class="ghost-btn" id="btn-restart">Restart game</button>
          </div>
        </div>`);
      return;
    }
    if (isWin) {
      const totalTime = Math.round((Date.now() - this.startedAt) / 1000);
      const acc = this.totalClicks ? Math.round((this.totalFound / this.totalClicks) * 100) : 100;
      const mm = Math.floor(totalTime / 60);
      const ss = String(totalTime % 60).padStart(2, '0');
      this.setOverlay(`
        <div class="panel win-panel">
          <div class="eyebrow">Case closed!</div>
          <h2>You found them all!</h2>
          <p class="sub">All five scenes solved — a true master detective.</p>
          <div class="final-score">${this.score.toLocaleString('en-US')}</div>
          <div class="final-stats">
            <span>⏱ ${mm}:${ss} total</span><span>🎯 ${acc}% accuracy</span><span>🔍 ${this.totalFound} found</span>
          </div>
          <div class="level-recap">
            ${this.levelStats.map((s) => `<div><b>${s.name}</b><span>+${s.bonus} bonus · ${s.timeLeft}s left</span></div>`).join('')}
          </div>
          <button class="big-btn" id="btn-again">↻ &nbsp;Play again</button>
          <p class="keys">Thanks for playing ${GAME_NAME}!</p>
        </div>`);
      return;
    }
    this.setOverlay(`
      <div class="panel">
        <div class="eyebrow">Level ${this.levelIndex + 1} complete</div>
        <h2>${this.scene.name} — solved!</h2>
        <p class="sub">All ${this.scene.differences.length} differences found${this.wrongThisLevel === 0 ? ' — not a single wrong click!' : ''}.</p>
        <p class="score-line">Time bonus +${timeBonus}${perfect ? ` · Eagle-eye bonus +${perfect}` : ''} · Score <b>${this.score.toLocaleString('en-US')}</b></p>
        <div class="btn-row">
          <button class="big-btn" id="btn-next">Next level &nbsp;→</button>
          <button class="ghost-btn" id="btn-replay">Replay level</button>
        </div>
        <p class="keys">or press <kbd>N</kbd> for the next level</p>
      </div>`);
  }

  // -- main loop --------------------------------------------------------------
  frame(now) {
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    if (this.state === 'playing' && !this.paused) {
      this.timeLeft -= dt;
      const whole = Math.ceil(this.timeLeft);
      if (whole !== this.lastWholeSecond) {
        this.lastWholeSecond = whole;
        this.updateTimerHud();
        if (whole <= 10 && whole > 0) this.sfx.tick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateTimerHud();
        this.timeOut();
      }
    }
    this.draw(now, dt);
    requestAnimationFrame((t) => this.frame(t));
  }

  draw(now, dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.save();
    if (now < this.shakeUntil) {
      ctx.translate((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7);
    }
    // The two panels: left is the original, right is the changed twin.
    const all = new Set(this.scene.differences.map((d) => d.id));
    this.drawPanel(LEFT_X, new Set());
    this.drawPanel(RIGHT_X, all);
    // The "VS" badge between the panels.
    fillCircle(ctx, LEFT_X + PANEL_W + PANEL_GAP / 2, PANEL_Y + PANEL_H / 2, 22, '#2a2a33');
    strokeCircle(ctx, LEFT_X + PANEL_W + PANEL_GAP / 2, PANEL_Y + PANEL_H / 2, 22, GOLD, 2);
    text(ctx, 'VS', LEFT_X + PANEL_W + PANEL_GAP / 2, PANEL_Y + PANEL_H / 2 + 1, 15, GOLD, 'center', '800');
    // Found rings on both panels, plus wrong-click crosses.
    for (const m of this.markAnims) {
      m.t = Math.min(1, m.t + dt * 3);
      this.drawRing(LEFT_X, m);
      this.drawRing(RIGHT_X, m);
    }
    for (const w of this.wrongMarks) {
      w.t += dt;
      if (w.t > 0.6) continue;
      const a = 1 - w.t / 0.6;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w.x - 10, w.y - 10); ctx.lineTo(w.x + 10, w.y + 10);
      ctx.moveTo(w.x + 10, w.y - 10); ctx.lineTo(w.x - 10, w.y + 10);
      ctx.stroke();
      ctx.restore();
    }
    this.wrongMarks = this.wrongMarks.filter((w) => w.t <= 0.6);
    // Hint pulse on both panels.
    if (this.hintPulse && now < this.hintPulse.until) {
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      const hp = this.hintPulse;
      for (const px of [LEFT_X, RIGHT_X]) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = GOLD; ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        circle(ctx, px + hp.x, PANEL_Y + hp.y, (hp.r + 10) * pulse);
        ctx.stroke();
        ctx.restore();
      }
    } else if (this.hintPulse) {
      this.hintPulse = null;
    }
    ctx.restore();
    // Confetti falls over everything.
    if (this.confetti.length) {
      for (const c of this.confetti) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.vr * dt;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        ctx.restore();
      }
      this.confetti = this.confetti.filter((c) => c.y < CANVAS_H + 20);
    }
  }

  drawPanel(x, activeDiffs) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    // Scenes draw in panel-local coordinates (0..560, 0..420).
    ctx.translate(x, PANEL_Y);
    this.scene.draw(ctx, PANEL_W, PANEL_H, activeDiffs);
    ctx.restore();
    ctx.strokeStyle = 'rgba(42,42,51,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, PANEL_Y, PANEL_W, PANEL_H);
  }

  drawRing(panelX, m) {
    const ctx = this.ctx;
    const ease = 1 - Math.pow(1 - m.t, 3);
    const r = (m.r + 6) * (0.6 + 0.4 * ease);
    const alpha = 0.55 + 0.45 * ease;
    for (const px of [panelX]) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 4;
      circle(ctx, px + m.x, PANEL_Y + m.y, r);
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      circle(ctx, px + m.x, PANEL_Y + m.y, r - 5);
      ctx.stroke();
      // A small check badge at the ring's edge.
      const bx = px + m.x + r * 0.7;
      const by = PANEL_Y + m.y - r * 0.7;
      fillCircle(ctx, bx, by, 10, GOLD);
      ctx.strokeStyle = '#2a2a33'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bx - 5, by); ctx.lineTo(bx - 1.5, by + 3.5); ctx.lineTo(bx + 5, by - 3.5);
      ctx.stroke();
      ctx.restore();
    }
  }
}

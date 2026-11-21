// scenes.js — the five hand-drawn scenes.
// Every scene is pure Canvas 2D vector art, drawn fresh by code: no image files,
// no network. Each scene's draw() takes a Set of active difference ids; the left
// panel is drawn with none active (the original) and the right panel with all of
// them (the twin). A difference is one small, deliberate change — a colour, a
// missing object, a moved hand — fair to find, easy to miss at a glance.

import {
  rr, circle, ellipse, poly, star,
  fillCircle, strokeCircle, fillRect, fillRound, strokeRound,
  line, text, vgrad, glow,
} from './draw.js';

// ---------------------------------------------------------------------------
// Scene 1 — The Detective's Study
// ---------------------------------------------------------------------------
function drawStudy(ctx, W, H, d) {
  // Wall and floor.
  ctx.fillStyle = vgrad(ctx, 0, 0, W, 300, '#f6e7c6', '#e9cf9f');
  ctx.fillRect(0, 0, W, 300);
  ctx.fillStyle = vgrad(ctx, 0, 300, W, 120, '#a4713f', '#7d5230');
  ctx.fillRect(0, 300, W, 120);
  ctx.strokeStyle = 'rgba(90,55,20,0.35)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 46) { line(ctx, x, 300, x - 18, 420, 'rgba(90,55,20,0.35)', 1); }
  fillRect(ctx, 0, 294, W, 10, '#6b4423');

  // Window with night sky, moon and curtains.
  fillRound(ctx, 26, 26, 154, 164, 6, '#5d3a1a');
  const sky = vgrad(ctx, 36, 36, 134, 144, '#1c2a4a', '#4a5f9e');
  ctx.fillStyle = sky;
  ctx.fillRect(36, 36, 134, 144);
  fillCircle(ctx, 60, 60, 1.6, '#fff'); fillCircle(ctx, 90, 48, 1.4, '#ffe9a8');
  fillCircle(ctx, 140, 70, 1.6, '#fff'); fillCircle(ctx, 120, 120, 1.3, '#fff');
  fillCircle(ctx, 55, 140, 1.5, '#ffe9a8'); fillCircle(ctx, 155, 105, 1.2, '#fff');
  if (d.has('moon')) {
    // Changed twin: a full golden moon.
    fillCircle(ctx, 105, 92, 26, '#ffd76a');
    fillCircle(ctx, 96, 84, 5, '#e8b93e'); fillCircle(ctx, 114, 100, 4, '#e8b93e');
  } else {
    // Original: a slim crescent.
    fillCircle(ctx, 105, 92, 26, '#f7e8b0');
    fillCircle(ctx, 118, 84, 22, '#3d4f88');
  }
  line(ctx, 103, 36, 103, 180, '#5d3a1a', 4);
  line(ctx, 36, 108, 170, 108, '#5d3a1a', 4);
  // Curtains.
  ctx.fillStyle = '#7a2e2e';
  poly(ctx, [[26, 26], [58, 26], [50, 190], [26, 190]]); ctx.fill();
  poly(ctx, [[180, 26], [148, 26], [156, 190], [180, 190]]); ctx.fill();
  fillCircle(ctx, 52, 108, 5, '#d9a441'); fillCircle(ctx, 154, 108, 5, '#d9a441');

  // Bookshelf with three shelves of books.
  fillRound(ctx, 196, 26, 188, 234, 6, '#5d3a1a');
  ctx.fillStyle = '#3f2712';
  ctx.fillRect(206, 36, 168, 214);
  const bookCols = ['#b03a2e', '#2e6b8a', '#3d7a44', '#c98a2e', '#6a4a8a', '#8a5a2e', '#2e8a7a', '#a33e5e'];
  const shelves = [[44, 92], [112, 160], [180, 228]];
  shelves.forEach(([sy, ey], si) => {
    let bx = 212;
    let bi = si * 3;
    while (bx < 366) {
      const bw = 13 + ((bi * 7) % 9);
      const bh = ey - sy - 4;
      // The missing-book difference: one spine vanishes from the middle shelf.
      if (d.has('book') && si === 1 && bx > 296 && bx < 312) { bx += bw + 2; continue; }
      fillRect(ctx, bx, ey - bh, bw, bh, bookCols[bi % bookCols.length]);
      line(ctx, bx + 2, ey - bh + 5, bx + bw - 2, ey - bh + 5, 'rgba(255,255,255,0.35)', 1);
      bx += bw + 2;
      bi++;
    }
    fillRect(ctx, 206, ey, 168, 6, '#6b4423');
  });
  // A little potted plant on the top shelf.
  fillRound(ctx, 348, 66, 18, 16, 3, '#b03a2e');
  fillCircle(ctx, 357, 56, 10, '#3d7a44'); fillCircle(ctx, 350, 60, 7, '#4c8a54');

  // Framed portrait of the detective.
  fillRound(ctx, 396, 26, 138, 116, 4, '#c98a2e');
  ctx.fillStyle = '#efe3c8';
  ctx.fillRect(404, 34, 122, 100);
  fillCircle(ctx, 465, 82, 26, '#e8b98a'); // face
  ctx.fillStyle = '#3a2a1a';
  poly(ctx, [[440, 56], [490, 56], [484, 74], [446, 74]]); ctx.fill(); // hair
  if (d.has('portrait')) {
    // Changed twin: a fine moustache and a bow tie.
    ellipse(ctx, 465, 98, 14, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#3a2a1a'; ctx.fill();
    poly(ctx, [[455, 122], [465, 114], [475, 122], [465, 130]]); ctx.fill();
  } else {
    poly(ctx, [[452, 120], [465, 112], [478, 120], [465, 128]]); ctx.fillStyle = '#2e6b8a'; ctx.fill();
  }
  fillCircle(ctx, 456, 80, 3, '#2a1a10'); fillCircle(ctx, 474, 80, 3, '#2a1a10');
  ctx.fillStyle = '#2e4a2e';
  poly(ctx, [[428, 134], [465, 108], [502, 134]]); ctx.fill(); // shoulders

  // Round wall clock.
  fillCircle(ctx, 465, 205, 46, '#5d3a1a');
  fillCircle(ctx, 465, 205, 40, '#fdf6e0');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    fillCircle(ctx, 465 + Math.sin(a) * 33, 205 - Math.cos(a) * 33, i % 3 === 0 ? 2.5 : 1.2, '#5d3a1a');
  }
  if (d.has('clock')) {
    line(ctx, 465, 205, 465 + 20, 205 + 14, '#2a1a10', 4); // 4:40
    line(ctx, 465, 205, 465 - 12, 205 + 26, '#2a1a10', 3);
  } else {
    line(ctx, 465, 205, 465 - 18, 205 - 18, '#2a1a10', 4); // 10:10
    line(ctx, 465, 205, 465 + 18, 205 - 18, '#2a1a10', 3);
  }
  fillCircle(ctx, 465, 205, 4, '#b03a2e');

  // Desk.
  fillRound(ctx, 20, 272, 520, 18, 4, '#6b4423');
  fillRect(ctx, 30, 290, 14, 84, '#5d3a1a');
  fillRect(ctx, 516, 290, 14, 84, '#5d3a1a');
  fillRound(ctx, 380, 292, 120, 70, 4, '#7d5230');
  fillCircle(ctx, 440, 327, 5, '#d9a441'); fillCircle(ctx, 440, 352, 5, '#d9a441');
  // Desk lamp with a warm glow (on in the original, off in the twin).
  if (!d.has('lamp')) glow(ctx, 95, 268, 90, '#ffd76a', 0.6);
  line(ctx, 95, 290, 95, 252, '#2a1a10', 5);
  ellipse(ctx, 95, 292, 18, 5); ctx.fillStyle = '#2a1a10'; ctx.fill();
  poly(ctx, [[74, 252], [116, 252], [106, 224], [84, 224]]); ctx.fillStyle = '#2e6b4f'; ctx.fill();
  if (!d.has('lamp')) { fillCircle(ctx, 95, 252, 7, '#ffe9a8'); }
  // Papers, inkwell and quill.
  ctx.save(); ctx.translate(215, 280); ctx.rotate(-0.06);
  fillRound(ctx, 0, 0, 66, 26, 2, '#fdf6e0'); fillRound(ctx, 4, -4, 66, 26, 2, '#f3e9cf');
  ctx.restore();
  line(ctx, 226, 288, 272, 286, '#8a7a5a', 1); line(ctx, 226, 296, 262, 294, '#8a7a5a', 1);
  fillRound(ctx, 296, 272, 22, 16, 4, '#2e4a8a');
  line(ctx, 314, 272, 330, 246, '#e8e0c8', 3);
  poly(ctx, [[330, 246], [336, 252], [328, 254]]); ctx.fillStyle = '#e8e0c8'; ctx.fill();
  // Magnifying glass — present in the original, gone in the twin.
  if (!d.has('magnifier')) {
    strokeCircle(ctx, 432, 316, 20, '#c98a2e', 5);
    fillCircle(ctx, 432, 316, 17, 'rgba(180,220,255,0.25)');
    line(ctx, 447, 330, 466, 348, '#6b4423', 6);
  }
  // Pipe resting on the desk.
  line(ctx, 480, 282, 510, 282, '#3a2a1a', 4);
  fillCircle(ctx, 512, 280, 6, '#3a2a1a');

  // Rug and the sleeping cat.
  ellipse(ctx, 280, 398, 128, 20); ctx.fillStyle = '#a33e3e'; ctx.fill();
  ellipse(ctx, 280, 398, 100, 14); ctx.fillStyle = '#e8d0a8'; ctx.fill();
  ellipse(ctx, 280, 398, 70, 9); ctx.fillStyle = '#a33e3e'; ctx.fill();
  // Cat body.
  ellipse(ctx, 272, 392, 34, 12); ctx.fillStyle = '#e8a34c'; ctx.fill();
  fillCircle(ctx, 300, 386, 11, '#e8a34c');
  poly(ctx, [[293, 378], [296, 370], [301, 378]]); ctx.fillStyle = '#e8a34c'; ctx.fill();
  poly(ctx, [[303, 378], [307, 370], [310, 378]]); ctx.fill();
  line(ctx, 296, 386, 300, 386, '#8a5a2e', 1); line(ctx, 304, 386, 308, 386, '#8a5a2e', 1);
  // Tail: curled up in the original, lying flat in the twin.
  ctx.strokeStyle = '#e8a34c'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath();
  if (d.has('cattail')) { ctx.moveTo(240, 394); ctx.quadraticCurveTo(222, 398, 214, 390); }
  else { ctx.moveTo(240, 394); ctx.quadraticCurveTo(228, 372, 240, 366); }
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Scene 2 — The Night Market
// ---------------------------------------------------------------------------
function drawMarket(ctx, W, H, d) {
  // Dusk sky and cobbled ground.
  ctx.fillStyle = vgrad(ctx, 0, 0, W, 240, '#2b1a4d', '#c65a3c');
  ctx.fillRect(0, 0, W, 240);
  ctx.fillStyle = vgrad(ctx, 0, 240, W, 180, '#4a3428', '#33241c');
  ctx.fillRect(0, 240, W, 180);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
  for (let y = 260; y < 420; y += 26) line(ctx, 0, y, W, y, 'rgba(0,0,0,0.25)', 1);
  for (let x = 10; x < W; x += 52) line(ctx, x, 240, x - 14, 420, 'rgba(0,0,0,0.25)', 1);
  // Stars and the moon (crescent in the original, full in the twin).
  for (const [sx, sy] of [[40, 30], [90, 55], [150, 26], [210, 48], [330, 30], [380, 60], [520, 30], [545, 90]]) {
    star(ctx, sx, sy, 3.5, 1.5); ctx.fillStyle = '#ffe9a8'; ctx.fill();
  }
  if (d.has('moon')) {
    fillCircle(ctx, 478, 62, 26, '#ffd76a');
    fillCircle(ctx, 470, 54, 5, '#e8b93e'); fillCircle(ctx, 488, 70, 4, '#e8b93e');
  } else {
    fillCircle(ctx, 478, 62, 26, '#f7e8b0');
    fillCircle(ctx, 490, 54, 22, '#7a4a6a');
  }

  // String of little lanterns across the sky.
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 26); ctx.quadraticCurveTo(280, 78, 560, 26); ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const lx = 20 + t * 520;
    const ly = 26 + Math.sin(t * Math.PI) * 44 + 8;
    line(ctx, lx, ly - 12, lx, ly, '#2a1a10', 1);
    fillCircle(ctx, lx, ly + 4, 7, ['#e84a3a', '#f2a541', '#e84a3a', '#c94a7a'][i % 4]);
    fillCircle(ctx, lx, ly - 4, 3, '#d9a441');
  }

  // Striped awning over the stall.
  const stripes = ['#b03a2e', '#f3e9cf', '#b03a2e', '#f3e9cf', '#b03a2e', '#f3e9cf', '#b03a2e', '#f3e9cf'];
  for (let i = 0; i < 8; i++) {
    // Changed twin: the sixth stripe turns deep blue.
    const col = (d.has('awning') && i === 5) ? '#2e4a8a' : stripes[i];
    ctx.fillStyle = col;
    ctx.fillRect(150 + i * 32, 78, 32, 42);
  }
  for (let i = 0; i < 8; i++) {
    ctx.beginPath(); ctx.arc(150 + i * 32 + 16, 120, 16, 0, Math.PI); ctx.fillStyle = stripes[i]; ctx.fill();
  }
  line(ctx, 150, 78, 150, 150, '#5d3a1a', 4); line(ctx, 406, 78, 406, 150, '#5d3a1a', 4);

  // Hanging sign under the awning.
  fillRound(ctx, 216, 138, 128, 46, 6, '#3a2a1a');
  strokeRound(ctx, 216, 138, 128, 46, 6, '#d9a441', 2);
  text(ctx, 'PASAR MALAM', 280, 156, 15, '#f2d98a');
  if (d.has('sign')) {
    star(ctx, 280, 176, 7, 3); ctx.fillStyle = '#f2d98a'; ctx.fill();
  } else {
    fillCircle(ctx, 280, 176, 6, '#f2d98a');
    fillCircle(ctx, 284, 172, 5, '#3a2a1a');
  }

  // Two big paper lanterns flanking the stall.
  function paperLantern(x, y, color) {
    glow(ctx, x, y, 46, color, 0.5);
    ellipse(ctx, x, y, 22, 28); ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    for (let k = -2; k <= 2; k++) ellipse(ctx, x, y + k * 9, 20 - Math.abs(k) * 3, 26 - Math.abs(k) * 2), ctx.stroke();
    fillRect(ctx, x - 8, y - 32, 16, 6, '#d9a441');
    fillRect(ctx, x - 8, y + 26, 16, 6, '#d9a441');
  }
  paperLantern(72, 150, d.has('lantern') ? '#f2c94a' : '#d9382a');
  paperLantern(488, 150, '#d9382a');

  // Stall counter and crates of fruit.
  fillRound(ctx, 36, 286, 488, 20, 4, '#7a4a26');
  fillRound(ctx, 44, 306, 472, 74, 4, '#5d3a1a');
  fillRect(ctx, 44, 306, 472, 6, '#8a5a33');
  // Crate of oranges.
  fillRound(ctx, 70, 238, 110, 50, 4, '#8a5a33');
  for (const [ox, oy] of [[88, 258], [112, 250], [136, 258], [160, 250], [100, 270], [126, 272], [150, 270]]) {
    fillCircle(ctx, ox, oy, 10, '#f28c2e'); fillCircle(ctx, ox - 3, oy - 3, 3, '#ffb35e');
  }
  // Crate of apples — one apple goes missing in the twin.
  fillRound(ctx, 200, 238, 110, 50, 4, '#8a5a33');
  const apples = [[218, 258], [242, 250], [266, 258], [290, 250], [230, 270], [256, 272], [280, 270]];
  apples.forEach(([ax, ay], i) => {
    if (d.has('apple') && i === 3) return;
    fillCircle(ctx, ax, ay, 10, '#c62e3a');
    fillCircle(ctx, ax - 3, ay - 3, 3, '#e86a72');
    line(ctx, ax, ay - 10, ax + 3, ay - 15, '#3d7a44', 2);
  });
  // Crate of grapes.
  fillRound(ctx, 330, 238, 100, 50, 4, '#8a5a33');
  for (const [gx, gy] of [[348, 252], [366, 248], [384, 252], [402, 248], [356, 266], [376, 268], [396, 266], [412, 260]]) {
    fillCircle(ctx, gx, gy, 7, '#6a4a8a'); fillCircle(ctx, gx - 2, gy - 2, 2, '#9a7ac0');
  }
  // Jars on the counter — an extra jar appears in the twin.
  function jar(x, y, col) {
    fillRound(ctx, x - 14, y - 26, 28, 34, 6, col);
    fillRound(ctx, x - 16, y - 32, 32, 8, 3, '#d9a441');
    ellipse(ctx, x, y - 8, 9, 5); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  }
  jar(452, 282, '#2e8a7a'); jar(488, 282, '#c98a2e');
  if (d.has('jar')) jar(414, 282, '#a33e5e');
  // Coins and a small scale on the counter.
  fillCircle(ctx, 60, 300, 7, '#d9a441'); fillCircle(ctx, 74, 302, 7, '#d9a441'); fillCircle(ctx, 66, 310, 7, '#f2c94a');

  // The market cat, sitting on a crate, wearing a bow tie.
  ellipse(ctx, 138, 356, 30, 12); ctx.fillStyle = '#4a4a55'; ctx.fill();
  fillCircle(ctx, 138, 330, 16, '#4a4a55');
  poly(ctx, [[126, 318], [130, 306], [136, 318]]); ctx.fillStyle = '#4a4a55'; ctx.fill();
  poly(ctx, [[140, 318], [146, 306], [150, 318]]); ctx.fill();
  fillCircle(ctx, 132, 328, 2, '#ffd76a'); fillCircle(ctx, 144, 328, 2, '#ffd76a');
  // Bow tie: red in the original, teal in the twin.
  ctx.fillStyle = d.has('catbow') ? '#2e8a7a' : '#c62e3a';
  poly(ctx, [[138, 348], [126, 342], [126, 354]]); ctx.fill();
  poly(ctx, [[138, 348], [150, 342], [150, 354]]); ctx.fill();
  fillCircle(ctx, 138, 348, 3, '#d9a441');
  // Tail.
  ctx.strokeStyle = '#4a4a55'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(164, 356); ctx.quadraticCurveTo(184, 348, 182, 332); ctx.stroke();
}

// ---------------------------------------------------------------------------
// Scene 3 — The Sunny Garden
// ---------------------------------------------------------------------------
function drawGarden(ctx, W, H, d) {
  // Sky, sun and clouds.
  ctx.fillStyle = vgrad(ctx, 0, 0, W, 270, '#6fbdf2', '#dff3ff');
  ctx.fillRect(0, 0, W, 270);
  // Sun with rays — it wears sunglasses in the twin.
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    line(ctx, 470 + Math.cos(a) * 40, 66 + Math.sin(a) * 40, 470 + Math.cos(a) * 52, 66 + Math.sin(a) * 52, '#f2c94a', 4);
  }
  fillCircle(ctx, 470, 66, 34, '#ffd94a');
  fillCircle(ctx, 458, 60, 4, '#8a5a2e'); fillCircle(ctx, 482, 60, 4, '#8a5a2e');
  ctx.strokeStyle = '#8a5a2e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(470, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (d.has('sunglasses')) {
    fillRound(ctx, 448, 52, 20, 12, 5, '#2a2a33');
    fillRound(ctx, 472, 52, 20, 12, 5, '#2a2a33');
    line(ctx, 468, 57, 472, 57, '#2a2a33', 3);
  }
  // Clouds — one extra drifts in for the twin.
  function cloud(x, y, s) {
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ellipse(ctx, x, y, 34 * s, 16 * s); ctx.fill();
    ellipse(ctx, x - 22 * s, y + 6 * s, 22 * s, 12 * s); ctx.fill();
    ellipse(ctx, x + 24 * s, y + 6 * s, 24 * s, 12 * s); ctx.fill();
  }
  cloud(90, 56, 1); cloud(300, 40, 0.8); cloud(380, 110, 0.7);
  if (d.has('cloud')) cloud(160, 108, 0.6);

  // Rolling green lawn and a stone path.
  ctx.fillStyle = vgrad(ctx, 0, 260, W, 160, '#5da24a', '#3d7a34');
  ctx.fillRect(0, 260, W, 160);
  for (const [px, py, pr] of [[280, 300, 26], [280, 350, 30], [280, 398, 32], [250, 326, 18], [312, 372, 18]]) {
    ellipse(ctx, px, py, pr, pr * 0.55); ctx.fillStyle = '#d9c9a8'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  }
  // Grass tufts.
  ctx.strokeStyle = '#2e6b2e'; ctx.lineWidth = 2;
  for (let i = 0; i < 26; i++) {
    const gx = (i * 67) % 540 + 10;
    const gy = 280 + ((i * 37) % 120);
    line(ctx, gx, gy, gx - 3, gy - 8, '#2e6b2e', 2);
    line(ctx, gx + 4, gy, gx + 6, gy - 9, '#2e6b2e', 2);
  }
  // Two little bushes and a scatter of daisies to fill the lawn.
  const bush = (x, y) => {
    fillCircle(ctx, x, y, 16, '#3d7a34');
    fillCircle(ctx, x - 12, y + 4, 11, '#4c8a3e');
    fillCircle(ctx, x + 12, y + 4, 11, '#4c8a3e');
    fillCircle(ctx, x, y - 6, 10, '#5da24a');
  };
  bush(52, 306); bush(512, 306);
  const daisy = (x, y) => {
    for (let p = 0; p < 5; p++) {
      const a = (p * Math.PI * 2) / 5;
      fillCircle(ctx, x + Math.cos(a) * 4, y + Math.sin(a) * 4, 2.5, '#fff');
    }
    fillCircle(ctx, x, y, 2.5, '#f2d94a');
  };
  daisy(60, 340); daisy(88, 356); daisy(500, 340); daisy(472, 356); daisy(348, 396); daisy(160, 400);

  // The old apple tree with a birdhouse.
  ctx.fillStyle = '#6b4423';
  poly(ctx, [[92, 280], [104, 280], [108, 180], [88, 180]]); ctx.fill();
  line(ctx, 100, 220, 140, 190, '#6b4423', 8);
  line(ctx, 98, 200, 62, 172, '#6b4423', 7);
  const leaf = (x, y, r, c) => { fillCircle(ctx, x, y, r, c); };
  leaf(100, 150, 52, '#3d7a34'); leaf(60, 170, 38, '#4c8a3e'); leaf(142, 168, 40, '#4c8a3e');
  leaf(78, 128, 30, '#5da24a'); leaf(126, 126, 32, '#5da24a'); leaf(100, 110, 28, '#6ab054');
  for (const [ax, ay] of [[76, 150], [118, 140], [140, 176], [64, 186], [104, 168]]) {
    fillCircle(ctx, ax, ay, 6, '#c62e3a'); fillCircle(ctx, ax - 2, ay - 2, 2, '#e86a72');
  }
  // Birdhouse on the trunk.
  fillRound(ctx, 118, 196, 34, 30, 3, '#8a5a33');
  poly(ctx, [[114, 198], [135, 182], [156, 198]]); ctx.fillStyle = '#b03a2e'; ctx.fill();
  fillCircle(ctx, 135, 212, 6, '#2a1a10');
  // A little blue bird on the branch — there in the original, flown away in the twin.
  if (!d.has('bird')) {
    fillCircle(ctx, 126, 178, 9, '#3a7ac9');
    fillCircle(ctx, 133, 172, 6, '#3a7ac9');
    poly(ctx, [[138, 172], [144, 174], [138, 176]]); ctx.fillStyle = '#f2a541'; ctx.fill();
    fillCircle(ctx, 135, 170, 1.5, '#1a1a22');
    line(ctx, 120, 186, 112, 192, '#3a7ac9', 3);
  }

  // The stone fountain with a spray of water.
  fillRound(ctx, 330, 300, 130, 26, 10, '#b8b0a0');
  fillRound(ctx, 336, 292, 118, 16, 8, '#d9d2c2');
  ellipse(ctx, 395, 300, 52, 9); ctx.fillStyle = '#7ec8f2'; ctx.fill();
  fillRound(ctx, 388, 262, 14, 40, 4, '#b8b0a0');
  for (const [fx, fy] of [[372, 250], [388, 238], [404, 250], [418, 262], [378, 266]]) {
    fillCircle(ctx, fx, fy, 5, '#a8dcf7');
  }
  ctx.strokeStyle = '#a8dcf7'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(395, 240); ctx.quadraticCurveTo(372, 258, 366, 282); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(395, 240); ctx.quadraticCurveTo(418, 258, 424, 282); ctx.stroke();
  // A goldfish swims in the fountain in the twin.
  if (d.has('fish')) {
    ellipse(ctx, 400, 301, 9, 4); ctx.fillStyle = '#f28c2e'; ctx.fill();
    poly(ctx, [[391, 301], [386, 296], [386, 306]]); ctx.fillStyle = '#f28c2e'; ctx.fill();
    fillCircle(ctx, 406, 300, 1.5, '#1a1a22');
  }

  // Wooden bench with a cushion — striped in the original, plain in the twin.
  fillRect(ctx, 226, 316, 96, 10, '#8a5a33');
  fillRect(ctx, 226, 330, 96, 8, '#7a4a26');
  fillRect(ctx, 232, 338, 8, 34, '#6b4423'); fillRect(ctx, 308, 338, 8, 34, '#6b4423');
  fillRound(ctx, 232, 300, 84, 16, 6, d.has('cushion') ? '#c98a2e' : '#e86a72');
  if (!d.has('cushion')) {
    ctx.strokeStyle = '#f3e9cf'; ctx.lineWidth = 2;
    line(ctx, 252, 300, 252, 316, '#f3e9cf', 2); line(ctx, 274, 300, 274, 316, '#f3e9cf', 2); line(ctx, 296, 300, 296, 316, '#f3e9cf', 2);
  }

  // Flower beds along the bottom.
  const tulip = (x, y, col) => {
    line(ctx, x, y, x, y + 22, '#2e6b2e', 3);
    ellipse(ctx, x - 7, y + 22, 8, 3); ctx.fillStyle = '#3d7a34'; ctx.fill();
    ctx.fillStyle = col;
    poly(ctx, [[x - 8, y], [x - 8, y - 12], [x - 4, y - 16], [x, y - 11], [x + 4, y - 16], [x + 8, y - 12], [x + 8, y]]); ctx.fill();
  };
  const cols = ['#e84a6a', '#f2a541', '#c94a7a', '#e84a6a', '#f2a541'];
  for (let i = 0; i < 5; i++) tulip(40 + i * 22, 372, cols[i]);
  for (let i = 0; i < 5; i++) tulip(430 + i * 22, 372, cols[(i + 2) % 5]);
  // One tulip changes colour in the twin.
  tulip(196, 372, d.has('tulip') ? '#f2d94a' : '#e84a6a');
  tulip(218, 372, '#c94a7a'); tulip(174, 372, '#f2a541');

  // A butterfly drifting over the lawn — gone in the twin.
  if (!d.has('butterfly')) {
    const bx = 246, by = 148;
    ctx.fillStyle = '#e86a9a';
    ellipse(ctx, bx - 8, by - 6, 9, 6); ctx.fill();
    ellipse(ctx, bx + 8, by - 6, 9, 6); ctx.fill();
    ellipse(ctx, bx - 6, by + 6, 6, 5); ctx.fill();
    ellipse(ctx, bx + 6, by + 6, 6, 5); ctx.fill();
    line(ctx, bx, by - 10, bx, by + 10, '#2a1a10', 2);
    fillCircle(ctx, bx - 8, by - 8, 2, '#fff'); fillCircle(ctx, bx + 8, by - 8, 2, '#fff');
  }
}

// ---------------------------------------------------------------------------
// Scene 4 — The Cozy Bakery
// ---------------------------------------------------------------------------
function drawBakery(ctx, W, H, d) {
  // Warm wall and wooden floor.
  ctx.fillStyle = vgrad(ctx, 0, 0, W, 290, '#f7e3c0', '#eecf9e');
  ctx.fillRect(0, 0, W, 290);
  ctx.fillStyle = vgrad(ctx, 0, 290, W, 130, '#a4713f', '#7d5230');
  ctx.fillRect(0, 290, W, 130);
  ctx.strokeStyle = 'rgba(90,55,20,0.35)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 46) line(ctx, x, 290, x - 18, 420, 'rgba(90,55,20,0.35)', 1);
  fillRect(ctx, 0, 284, W, 10, '#6b4423');

  // Window with a street view and a flower pot on the sill.
  fillRound(ctx, 26, 26, 140, 150, 6, '#5d3a1a');
  ctx.fillStyle = vgrad(ctx, 36, 36, 120, 130, '#9fd4f2', '#f7e3c0');
  ctx.fillRect(36, 36, 120, 130);
  fillCircle(ctx, 132, 60, 16, '#ffd94a');
  fillRect(ctx, 36, 128, 120, 38, '#7a9a5a');
  fillRect(ctx, 96, 96, 34, 70, '#b03a2e'); // a little house across the street
  poly(ctx, [[92, 98], [113, 80], [134, 98]]); ctx.fillStyle = '#5d3a1a'; ctx.fill();
  line(ctx, 96, 36, 96, 166, '#5d3a1a', 4);
  // Gingham curtains.
  ctx.fillStyle = '#e86a72';
  poly(ctx, [[26, 26], [56, 26], [50, 120], [26, 120]]); ctx.fill();
  poly(ctx, [[166, 26], [136, 26], [142, 120], [166, 120]]); ctx.fill();
  // Flower pot: blooming in the original, just leaves in the twin.
  fillRound(ctx, 66, 150, 28, 18, 3, '#b03a2e');
  if (!d.has('windowflower')) {
    fillCircle(ctx, 80, 142, 7, '#e84a6a'); fillCircle(ctx, 72, 146, 5, '#f2a541'); fillCircle(ctx, 88, 146, 5, '#e84a6a');
  } else {
    fillCircle(ctx, 76, 144, 6, '#3d7a44'); fillCircle(ctx, 86, 144, 6, '#4c8a54');
  }

  // Shelves with bread and cakes.
  fillRound(ctx, 190, 30, 190, 190, 6, '#5d3a1a');
  ctx.fillStyle = '#3f2712';
  ctx.fillRect(200, 40, 170, 170);
  // Top shelf: cakes with cherries.
  const cake = (x, y, topCol) => {
    fillRound(ctx, x, y, 40, 22, 4, '#f3e9cf');
    fillRound(ctx, x, y, 40, 8, 4, topCol);
    fillCircle(ctx, x + 20, y - 2, 5, '#c62e3a');
  };
  cake(210, 66, '#e86a9a'); cake(262, 66, '#7ec8f2');
  // The third cake's topping changes in the twin: cherry becomes a strawberry.
  cake(314, 66, '#f2a541');
  if (d.has('caketop')) {
    fillCircle(ctx, 334, 64, 5, '#c62e3a');
    poly(ctx, [[334, 58], [330, 52], [338, 52]]); ctx.fillStyle = '#3d7a44'; ctx.fill();
    ctx.fillStyle = '#e84a6a';
    poly(ctx, [[329, 64], [339, 64], [334, 74]]); ctx.fill();
  }
  fillRect(ctx, 200, 92, 170, 6, '#6b4423');
  // Middle shelf: bread loaves — one goes missing in the twin.
  const loaf = (x, y) => {
    ellipse(ctx, x, y, 24, 12); ctx.fillStyle = '#c98a2e'; ctx.fill();
    line(ctx, x - 12, y - 4, x + 12, y - 4, '#8a5a2e', 2);
    line(ctx, x - 10, y + 2, x + 10, y + 2, '#8a5a2e', 2);
  };
  loaf(232, 128); loaf(288, 128);
  if (!d.has('bread')) loaf(344, 128);
  fillRect(ctx, 200, 146, 170, 6, '#6b4423');
  // Bottom shelf: jars and a teapot.
  function jar2(x, y, col) {
    fillRound(ctx, x - 14, y - 22, 28, 30, 6, col);
    fillRound(ctx, x - 16, y - 28, 32, 8, 3, '#d9a441');
  }
  jar2(228, 198, '#2e8a7a'); jar2(272, 198, '#c98a2e'); jar2(316, 198, '#a33e5e');
  fillCircle(ctx, 352, 192, 12, '#3a7ac9');
  line(ctx, 340, 188, 330, 178, '#3a7ac9', 4);

  // Chalkboard menu.
  fillRound(ctx, 400, 30, 134, 116, 6, '#3a2a1a');
  strokeRound(ctx, 400, 30, 134, 116, 6, '#c98a2e', 3);
  text(ctx, 'MENU', 467, 52, 16, '#f3e9cf');
  line(ctx, 420, 66, 514, 66, 'rgba(243,233,207,0.5)', 1);
  text(ctx, 'Croissant', 428, 84, 12, '#f3e9cf', 'left', '600');
  text(ctx, 'Cake', 428, 106, 12, '#f3e9cf', 'left', '600');
  text(ctx, '5', 510, 84, 12, '#f3e9cf', 'right', '600');
  // The cake price changes in the twin: 8 instead of 5.
  text(ctx, d.has('menuprice') ? '8' : '5', 510, 106, 12, '#ffd76a', 'right', '700');

  // Hanging lamp — glowing in the original, dark in the twin.
  line(ctx, 280, 0, 280, 34, '#2a1a10', 3);
  if (!d.has('lamp')) glow(ctx, 280, 52, 80, '#ffd76a', 0.55);
  poly(ctx, [[262, 58], [298, 58], [290, 34], [270, 34]]); ctx.fillStyle = '#2e6b4f'; ctx.fill();
  if (!d.has('lamp')) fillCircle(ctx, 280, 58, 6, '#ffe9a8');

  // Counter with jars and the bakery cat.
  fillRound(ctx, 20, 300, 520, 18, 4, '#6b4423');
  fillRound(ctx, 30, 318, 500, 66, 4, '#7d5230');
  // Jar of cookies on the counter — candy in the twin.
  fillRound(ctx, 96, 330, 44, 46, 6, 'rgba(255,255,255,0.25)');
  fillRound(ctx, 92, 324, 52, 10, 3, '#d9a441');
  if (d.has('jar')) {
    for (const [jx, jy, jc] of [[108, 356, '#e84a6a'], [120, 348, '#f2a541'], [130, 360, '#3a7ac9'], [114, 366, '#7ec8f2']]) {
      fillCircle(ctx, jx, jy, 6, jc);
    }
  } else {
    fillCircle(ctx, 108, 352, 9, '#8a5a2e'); fillCircle(ctx, 126, 360, 9, '#a4713f'); fillCircle(ctx, 118, 368, 8, '#6b4423');
    fillCircle(ctx, 112, 349, 2, '#3a2a1a'); fillCircle(ctx, 128, 357, 2, '#3a2a1a');
  }
  // Rolling pin and flour sacks.
  line(ctx, 180, 352, 250, 352, '#c98a2e', 10);
  fillCircle(ctx, 176, 352, 6, '#8a5a2e'); fillCircle(ctx, 254, 352, 6, '#8a5a2e');
  fillRound(ctx, 280, 336, 44, 40, 6, '#e8dcc0');
  text(ctx, 'FLOUR', 302, 356, 11, '#8a7a5a');
  // The bakery cat, asleep on the counter.
  ellipse(ctx, 440, 356, 36, 13); ctx.fillStyle = '#f2f2f2'; ctx.fill();
  fillCircle(ctx, 470, 350, 12, '#f2f2f2');
  poly(ctx, [[462, 342], [465, 332], [470, 342]]); ctx.fillStyle = '#f2f2f2'; ctx.fill();
  poly(ctx, [[472, 342], [477, 332], [480, 342]]); ctx.fill();
  fillCircle(ctx, 466, 350, 1.6, '#2a1a10'); fillCircle(ctx, 474, 350, 1.6, '#2a1a10');
  ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath();
  if (d.has('cattail')) { ctx.moveTo(406, 358); ctx.quadraticCurveTo(392, 362, 388, 352); }
  else { ctx.moveTo(406, 358); ctx.quadraticCurveTo(396, 336, 410, 332); }
  ctx.stroke();
  // A little "OPEN" sign on the counter edge.
  fillRound(ctx, 500, 330, 30, 20, 3, '#2e6b4f');
  text(ctx, 'OPEN', 515, 340, 9, '#f3e9cf');
}

// ---------------------------------------------------------------------------
// Scene 5 — The Toy Workshop
// ---------------------------------------------------------------------------
function drawWorkshop(ctx, W, H, d) {
  // Wall, floor and window with the night sky.
  ctx.fillStyle = vgrad(ctx, 0, 0, W, 290, '#efe0b8', '#ddc48e');
  ctx.fillRect(0, 0, W, 290);
  ctx.fillStyle = vgrad(ctx, 0, 290, W, 130, '#a4713f', '#7d5230');
  ctx.fillRect(0, 290, W, 130);
  ctx.strokeStyle = 'rgba(90,55,20,0.35)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 46) line(ctx, x, 290, x - 18, 420, 'rgba(90,55,20,0.35)', 1);
  fillRect(ctx, 0, 284, W, 10, '#6b4423');
  fillRound(ctx, 430, 130, 110, 130, 6, '#5d3a1a');
  const nsky = vgrad(ctx, 440, 140, 90, 110, '#1c2a4a', '#4a5f9e');
  ctx.fillStyle = nsky; ctx.fillRect(440, 140, 90, 110);
  fillCircle(ctx, 458, 160, 1.5, '#fff'); fillCircle(ctx, 512, 168, 1.5, '#fff'); fillCircle(ctx, 492, 220, 1.4, '#ffe9a8');
  // A bright star in the original, a crescent moon in the twin.
  if (d.has('windowstar')) {
    fillCircle(ctx, 486, 186, 14, '#f7e8b0');
    fillCircle(ctx, 492, 180, 12, '#3d4f88');
  } else {
    star(ctx, 486, 186, 14, 6); ctx.fillStyle = '#ffd76a'; ctx.fill();
  }
  line(ctx, 485, 140, 485, 250, '#5d3a1a', 4);

  // String lights across the top.
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(280, 58, 560, 18); ctx.stroke();
  const bulbCols = ['#f2a541', '#e84a6a', '#3a7ac9', '#5da24a', '#f2d94a'];
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const bx = 24 + t * 512;
    const by = 18 + Math.sin(t * Math.PI) * 32 + 10;
    line(ctx, bx, by - 8, bx, by, '#2a1a10', 1);
    // Changed twin: the fifth bulb turns sky blue.
    const col = (d.has('bulb') && i === 4) ? '#3a7ac9' : bulbCols[i % 5];
    glow(ctx, bx, by + 4, 14, col, 0.45);
    fillCircle(ctx, bx, by + 4, 6, col);
  }

  // Shelves of toys.
  fillRound(ctx, 26, 40, 210, 170, 6, '#5d3a1a');
  ctx.fillStyle = '#3f2712';
  ctx.fillRect(36, 50, 190, 150);
  // Teddy bear with a bow.
  fillCircle(ctx, 82, 128, 16, '#b07a3e'); // body
  fillCircle(ctx, 82, 96, 13, '#b07a3e'); // head
  fillCircle(ctx, 70, 86, 5, '#b07a3e'); fillCircle(ctx, 94, 86, 5, '#b07a3e');
  fillCircle(ctx, 82, 98, 5, '#e8c898');
  fillCircle(ctx, 77, 93, 2, '#2a1a10'); fillCircle(ctx, 87, 93, 2, '#2a1a10');
  // Bow: red in the original, blue in the twin.
  ctx.fillStyle = d.has('teddybow') ? '#3a7ac9' : '#c62e3a';
  poly(ctx, [[82, 116], [70, 110], [70, 122]]); ctx.fill();
  poly(ctx, [[82, 116], [94, 110], [94, 122]]); ctx.fill();
  // Toy rocket — one fin fewer in the twin.
  ctx.fillStyle = '#d9d2c2';
  poly(ctx, [[176, 66], [188, 66], [196, 110], [168, 110]]); ctx.fill();
  poly(ctx, [[176, 66], [182, 48], [188, 66]]); ctx.fillStyle = '#c62e3a'; ctx.fill();
  fillCircle(ctx, 182, 82, 6, '#7ec8f2');
  ctx.fillStyle = '#c62e3a';
  poly(ctx, [[168, 110], [158, 126], [170, 118]]); ctx.fill();
  if (!d.has('rocketfin')) poly(ctx, [[196, 110], [206, 126], [194, 118]]); ctx.fill();
  fillCircle(ctx, 182, 122, 4, '#f2a541');
  // Wooden doll on the shelf.
  fillCircle(ctx, 128, 168, 12, '#e8b98a');
  poly(ctx, [[116, 168], [140, 168], [146, 200], [110, 200]]); ctx.fillStyle = '#e86a9a'; ctx.fill();
  fillCircle(ctx, 122, 166, 2, '#2a1a10'); fillCircle(ctx, 134, 166, 2, '#2a1a10');
  fillRect(ctx, 200, 146, 170, 6, '#6b4423');
  // Bottom shelf: blocks and a ball.
  const block = (x, y, col, letter) => {
    fillRound(ctx, x, y, 26, 26, 3, col);
    text(ctx, letter, x + 13, y + 14, 14, '#fff');
  };
  block(48, 168, '#c62e3a', 'A'); block(80, 168, '#3a7ac9', 'B'); block(112, 168, '#5da24a', 'C');
  fillCircle(ctx, 200, 182, 16, '#e84a6a');
  line(ctx, 184, 182, 216, 182, '#f3e9cf', 3);
  fillRect(ctx, 36, 200, 190, 6, '#6b4423');

  // Wall clock.
  fillCircle(ctx, 330, 86, 40, '#5d3a1a');
  fillCircle(ctx, 330, 86, 34, '#fdf6e0');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    fillCircle(ctx, 330 + Math.sin(a) * 28, 86 - Math.cos(a) * 28, i % 3 === 0 ? 2.2 : 1.1, '#5d3a1a');
  }
  if (d.has('clock')) {
    line(ctx, 330, 86, 330 + 16, 86 + 12, '#2a1a10', 4);
    line(ctx, 330, 86, 330 - 10, 86 + 22, '#2a1a10', 3);
  } else {
    line(ctx, 330, 86, 330 - 15, 86 - 15, '#2a1a10', 4);
    line(ctx, 330, 86, 330 + 15, 86 - 15, '#2a1a10', 3);
  }
  fillCircle(ctx, 330, 86, 3.5, '#b03a2e');

  // Tools hanging on the wall.
  line(ctx, 250, 140, 250, 190, '#8a8a8a', 6); // saw
  poly(ctx, [[244, 190], [256, 190], [250, 206]]); ctx.fillStyle = '#c8c8c8'; ctx.fill();
  line(ctx, 280, 140, 280, 186, '#c98a2e', 5); // screwdriver
  fillCircle(ctx, 280, 196, 5, '#8a8a8a');
  // Hammer: hanging on the wall in the original, lying on the bench in the twin.
  if (!d.has('hammer')) {
    line(ctx, 310, 140, 310, 178, '#8a5a2e', 6);
    fillRound(ctx, 296, 132, 28, 12, 3, '#8a8a8a');
  }

  // Workbench with the toy train.
  fillRound(ctx, 20, 300, 520, 16, 4, '#6b4423');
  fillRect(ctx, 30, 316, 14, 74, '#5d3a1a'); fillRect(ctx, 516, 316, 14, 74, '#5d3a1a');
  // Hammer on the bench in the twin.
  if (d.has('hammer')) {
    line(ctx, 60, 306, 96, 306, '#8a5a2e', 6);
    fillRound(ctx, 96, 298, 14, 16, 3, '#8a8a8a');
  }
  // Toy train: engine plus cars — three cars in the original, two in the twin.
  function trainCar(x, y, col) {
    fillRound(ctx, x, y, 44, 26, 5, col);
    fillCircle(ctx, x + 10, y + 28, 7, '#2a2a33'); fillCircle(ctx, x + 34, y + 28, 7, '#2a2a33');
  }
  fillRound(ctx, 300, 322, 52, 30, 5, '#2e6b8a'); // engine
  fillRound(ctx, 312, 306, 28, 18, 4, '#2e6b8a');
  fillCircle(ctx, 322, 336, 7, '#2a2a33'); fillCircle(ctx, 342, 336, 7, '#2a2a33');
  line(ctx, 352, 336, 362, 336, '#2a2a33', 3);
  trainCar(364, 322, '#c62e3a');
  line(ctx, 408, 336, 418, 336, '#2a2a33', 3);
  trainCar(420, 322, '#f2a541');
  if (!d.has('traincars')) {
    line(ctx, 464, 336, 474, 336, '#2a2a33', 3);
    trainCar(476, 322, '#5da24a');
  }
  // Sawdust and a glue pot on the bench.
  fillCircle(ctx, 150, 308, 3, '#e8dcc0'); fillCircle(ctx, 170, 310, 2.5, '#e8dcc0'); fillCircle(ctx, 190, 306, 3, '#e8dcc0');
  fillRound(ctx, 210, 296, 22, 16, 4, '#2e4a8a');
}

// ---------------------------------------------------------------------------
// The registry the game plays through.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    id: 'study', name: "The Detective's Study", tagline: 'A quiet room, a sleeping cat, seven small lies.',
    difficulty: 'Warm-up', accent: '#2e6b4f',
    differences: [
      { id: 'moon', label: 'The moon changed phase', x: 105, y: 92, r: 30 },
      { id: 'book', label: 'A book vanished from the shelf', x: 316, y: 138, r: 18 },
      { id: 'portrait', label: 'The portrait grew a moustache', x: 465, y: 85, r: 42 },
      { id: 'clock', label: 'The clock shows a different time', x: 465, y: 205, r: 44 },
      { id: 'lamp', label: 'The desk lamp went dark', x: 95, y: 262, r: 38 },
      { id: 'magnifier', label: 'The magnifying glass is gone', x: 432, y: 316, r: 22 },
      { id: 'cattail', label: 'The cat lowered its tail', x: 230, y: 380, r: 22 },
    ],
    draw: drawStudy,
  },
  {
    id: 'market', name: 'The Night Market', tagline: 'Lanterns, fruit and one stall with secrets.',
    difficulty: 'Getting warmer', accent: '#b03a2e',
    differences: [
      { id: 'moon', label: 'The moon changed phase', x: 478, y: 62, r: 28 },
      { id: 'lantern', label: 'A lantern changed colour', x: 72, y: 150, r: 28 },
      { id: 'awning', label: 'An awning stripe turned blue', x: 326, y: 99, r: 20 },
      { id: 'sign', label: 'The sign swapped its emblem', x: 280, y: 172, r: 18 },
      { id: 'apple', label: 'An apple went missing', x: 290, y: 250, r: 16 },
      { id: 'jar', label: 'An extra jar appeared', x: 414, y: 268, r: 22 },
      { id: 'catbow', label: "The cat's bow tie changed colour", x: 138, y: 348, r: 18 },
    ],
    draw: drawMarket,
  },
  {
    id: 'garden', name: 'The Sunny Garden', tagline: 'Birdsong, blossom and seven quiet changes.',
    difficulty: 'Sharp eyes needed', accent: '#3d7a34',
    differences: [
      { id: 'sunglasses', label: 'The sun put on sunglasses', x: 470, y: 60, r: 34 },
      { id: 'cloud', label: 'An extra cloud drifted in', x: 160, y: 108, r: 28 },
      { id: 'bird', label: 'The little bird flew away', x: 126, y: 178, r: 18 },
      { id: 'butterfly', label: 'The butterfly vanished', x: 246, y: 148, r: 18 },
      { id: 'cushion', label: 'The bench cushion lost its stripes', x: 274, y: 308, r: 24 },
      { id: 'fish', label: 'A goldfish swims in the fountain', x: 400, y: 301, r: 20 },
      { id: 'tulip', label: 'A tulip changed colour', x: 196, y: 366, r: 18 },
    ],
    draw: drawGarden,
  },
  {
    id: 'bakery', name: 'The Cozy Bakery', tagline: 'Fresh bread, warm light and a very sneaky cat.',
    difficulty: 'Crumb trail', accent: '#b03a2e',
    differences: [
      { id: 'windowflower', label: 'The window flower lost its bloom', x: 80, y: 144, r: 20 },
      { id: 'caketop', label: 'The cake topping changed', x: 334, y: 64, r: 16 },
      { id: 'bread', label: 'A loaf went missing', x: 344, y: 128, r: 20 },
      { id: 'menuprice', label: 'The cake price changed', x: 508, y: 106, r: 16 },
      { id: 'lamp', label: 'The hanging lamp went dark', x: 280, y: 52, r: 24 },
      { id: 'jar', label: 'The jar swapped cookies for candy', x: 118, y: 352, r: 24 },
      { id: 'cattail', label: 'The cat lowered its tail', x: 400, y: 344, r: 22 },
    ],
    draw: drawBakery,
  },
  {
    id: 'workshop', name: 'The Toy Workshop', tagline: 'Half-built toys and a clock that cannot agree.',
    difficulty: 'Master detective', accent: '#2e4a8a',
    differences: [
      { id: 'bulb', label: 'A string-light bulb changed colour', x: 251, y: 63, r: 16 },
      { id: 'teddybow', label: "The teddy's bow changed colour", x: 82, y: 116, r: 20 },
      { id: 'rocketfin', label: 'The rocket lost a fin', x: 200, y: 116, r: 20 },
      { id: 'clock', label: 'The clock shows a different time', x: 330, y: 86, r: 38 },
      { id: 'hammer', label: 'The hammer moved to the bench', x: 78, y: 306, r: 20 },
      { id: 'windowstar', label: 'The star in the window became a moon', x: 486, y: 186, r: 22 },
      { id: 'traincars', label: 'The train lost a car', x: 498, y: 334, r: 24 },
    ],
    draw: drawWorkshop,
  },
];

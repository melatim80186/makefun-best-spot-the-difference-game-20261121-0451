// shots.js — staged states for the maker's screenshots.
// ?shot=start  → the title screen over level 1
// ?shot=play   → level 1 mid-play, 2 differences already ringed
// ?shot=play2  → level 3 mid-play, 3 differences already ringed
// ?shot=end    → the win screen after all five scenes
// A shot never changes how the game plays; it only pre-sets the state so a
// screenshot shows the game at its best. Real players never see a ?shot= URL.

import { LEVELS } from './config.js';

function ringFound(game, count) {
  const diffs = game.scene.differences.slice(0, count);
  for (const d of diffs) {
    game.found.add(d.id);
    game.totalFound++;
    game.markAnims.push({ x: d.x, y: d.y, r: d.r, t: 1 });
  }
  game.score = count * 100 + 50;
  game.streak = count;
}

export function applyShot(game, query) {
  const shot = query.get('shot');
  if (!shot) return false;
  game.sfx.muted = true;
  // Staged shots hide the toast pill so it never covers the scene.
  const hideToast = () => {
    clearTimeout(game.toastTimer);
    game.hud.toast.classList.remove('show');
  };
  if (shot === 'start') {
    game.loadLevel(0);
    game.state = 'start';
    game.timeLeft = game.level.seconds;
    game.setOverlay(game.startOverlay());
    game.updateHud();
    return true;
  }
  if (shot === 'play') {
    game.loadLevel(0);
    ringFound(game, 2);
    game.timeLeft = 96;
    game.lastWholeSecond = 96;
    game.updateHud();
    hideToast();
    return true;
  }
  if (shot === 'play2') {
    game.loadLevel(2);
    ringFound(game, 3);
    game.timeLeft = 58;
    game.lastWholeSecond = 58;
    game.score = 640;
    game.updateHud();
    hideToast();
    return true;
  }
  if (shot === 'end') {
    game.score = 7240;
    game.totalFound = 33;
    game.totalClicks = 37;
    game.startedAt = Date.now() - 1000 * 60 * 8 - 1000 * 24;
    game.levelStats = LEVELS.map((l) => ({
      name: l.scene.name,
      timeLeft: 24 + l.index * 3,
      wrong: l.index % 2,
      bonus: 320 + l.index * 40,
    }));
    game.state = 'win';
    game.levelIndex = 4;
    game.timeLeft = 0;
    game.lastWholeSecond = 0;
    game.found = new Set(game.scene.differences.map((d) => d.id));
    for (const d of game.scene.differences) {
      game.markAnims.push({ x: d.x, y: d.y, r: d.r, t: 1 });
    }
    game.burstConfetti();
    game.showEndOverlay(true, 0, 0);
    game.updateHud();
    return true;
  }
  return false;
}

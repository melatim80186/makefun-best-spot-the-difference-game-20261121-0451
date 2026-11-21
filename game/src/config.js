// config.js — the game's tuning knobs: panel size, scoring, timers, level order.
// One file, one job: every number the game balances on lives here.
import { SCENES } from './scenes.js';

export const PANEL_W = 560;
export const PANEL_H = 420;
export const PANEL_GAP = 40;
export const CANVAS_W = PANEL_W * 2 + PANEL_GAP + 20;
export const CANVAS_H = PANEL_H + 40;

// Seconds on the clock for each level, easiest first.
export const LEVEL_SECONDS = [150, 135, 120, 105, 90];
// How many hints a player may spend per level.
export const HINTS_PER_LEVEL = 3;
// Points for a find, plus a streak bonus that grows with each find in a row.
export const FIND_POINTS = 100;
export const STREAK_BONUS = 10;
// Points lost on a wrong click, and on spending a hint.
export const WRONG_PENALTY = 25;
export const HINT_COST = 50;
// Time bonus per second left when a level is cleared, plus a no-mistake bonus.
export const TIME_BONUS_PER_SECOND = 5;
export const PERFECT_LEVEL_BONUS = 150;

// The five levels in order, each a scene from scenes.js.
export const LEVELS = SCENES.map((scene, i) => ({
  scene,
  seconds: LEVEL_SECONDS[i],
  index: i,
}));

export const GAME_NAME = 'Twin Scenes';
export const GAME_TITLE = 'Spot the Difference';
export const GAME_SUBTITLE = 'Five hand-drawn mysteries — find every change before the clock runs out.';

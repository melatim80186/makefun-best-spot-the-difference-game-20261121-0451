[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/melatim80186/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/melatim80186/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Scenes — Spot the Difference

Two pictures, side by side — almost the same. Find every difference before the clock runs out.

**Twin Scenes** is a complete spot-the-difference game that runs offline in a desktop browser from static files, with no network requests. Every scene is hand-drawn in code (Canvas 2D vector art — no image files): five original scenes, seven differences each, 35 in all.

## The five scenes

| # | Scene | Difficulty | Time |
|---|-------|-----------|------|
| 1 | The Detective's Study | Warm-up | 2:30 |
| 2 | The Night Market | Getting warmer | 2:15 |
| 3 | The Sunny Garden | Sharp eyes needed | 2:00 |
| 4 | The Cozy Bakery | Crumb trail | 1:45 |
| 5 | The Toy Workshop | Master detective | 1:30 |

Each scene hides seven changes between its twin pictures: a moon that changes phase, a book that vanishes, a portrait that grows a moustache, a cat that lowers its tail, a sun that puts on sunglasses, a train that loses a car — and more. The later scenes give you less time, so the hunt gets sharper as you go.

## How to play

- **Click a difference** on either picture to ring it in gold. A found difference is marked on both panels.
- **Wrong clicks** cost 25 points and reset your streak — look before you click.
- **Hints** (💡 button or `H`) pulse a ring around one difference you haven't found yet. Three per level, 50 points each.
- **Scoring:** 100 points per find, plus a growing streak bonus; a time bonus for every second left when you clear a level; a 150-point Eagle-Eye bonus for clearing a level with no wrong clicks.
- **Win** by clearing all five scenes. Your total score, time and accuracy are shown on the final screen.

## Controls

| Key / Click | Action |
|-------------|--------|
| Mouse click | Mark a difference |
| `H` | Hint (3 per level) |
| `R` | Restart the current level |
| `N` | Next level (after clearing one) |
| `M` | Toggle sound |
| `Enter` / `Space` | Start / play again |

Sound effects are synthesized live with WebAudio — no audio files.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `game/index.html` through any static file server. The game needs no build step and makes no network requests.

## Layout

- `game/index.html` — the page: HUD, stage, overlays
- `game/src/style.css` — the frame around the pictures
- `game/src/config.js` — tuning: timers, scoring, level order
- `game/src/draw.js` — small canvas drawing helpers
- `game/src/scenes.js` — the five hand-drawn scenes and their 35 differences
- `game/src/audio.js` — WebAudio sound effects
- `game/src/game.js` — state, input, scoring, hints, timer, confetti
- `game/src/shots.js` — staged states used only to take the screenshots
- `game/src/main.js` — bootstrap and keyboard wiring
- `main.ts` — the make.fun entrypoint: copies `game/` and `screenshots/` to the output directory and writes `dossier.json`
- `screenshots/` — real renders of this game's own code

## License

MIT — see [LICENSE](LICENSE).

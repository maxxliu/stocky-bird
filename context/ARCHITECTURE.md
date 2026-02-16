# Stocky Bird — Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (barely used — game is canvas-only) |
| Font | Geist Mono (via next/font) |
| Rendering | HTML5 Canvas 2D API |
| Audio | Web Audio API |
| Persistence | localStorage |

## Dependency Graph

```
page.tsx
  └── Game.tsx  (React 'use client' component, owns <canvas>)
        └── GameEngine  (created once in useEffect, destroyed on unmount)
              ├── InputManager       (event listeners on canvas + window)
              ├── AudioManager       (lazy AudioContext, procedural sounds)
              ├── Player             (position, velocity, physics)
              ├── GateManager
              │     └── Gate[6]      (pre-allocated object pool)
              ├── MathQuestionSystem (question gen, answer validation)
              └── Renderer           (master dispatcher)
                    ├── BackgroundRenderer
                    ├── PlayerRenderer
                    ├── GateRenderer
                    ├── HudRenderer
                    └── MathOverlayRenderer
```

## Data Flow

### React → Engine (one-way, construction only)

`Game.tsx` creates a `GameEngine` instance inside a `useEffect`, passing the canvas element. After construction, React has no further involvement — no state, no re-renders, no props flowing down. The engine is destroyed in the useEffect cleanup.

### Engine → Renderers (per-frame)

Each frame, `GameEngine` calls `Renderer.render(ctx, state, ...)` which dispatches to sub-renderers. Renderers read entity state directly (player position, gate positions, math question data) — there is no intermediate data transform layer.

### Renderers → InputManager (answer regions sync)

`MathOverlayRenderer` writes `answerRegions[]` (bounding boxes of the 4 answer buttons) each frame. `GameEngine` syncs this to `InputManager.answerRegions` so that mouse/touch clicks can be hit-tested against the current button positions. This is the only renderer→engine data flow.

### InputManager → Engine (consume pattern)

`InputManager` buffers input events and exposes `consumeFlap()` and `consumeAnswer()`. Each method returns the pending input and clears it, ensuring one event per frame maximum.

## Game Loop

```
GameEngine.start()
  └── loop(now)                              [requestAnimationFrame]
        1. requestAnimationFrame(this.loop)   // schedule next frame first
        2. dt = (now - lastTime) / 1000       // seconds
        3. if dt > 1.0s → auto-pause          // tab was hidden
        4. clamp dt to 0.05s                  // prevent spiral of death
        5. if paused → render only, wait for flap to unpause
        6. update(dt)
              a. renderer.update(dt)           // grid scroll, flash timers
              b. mathSystem.updateLockout(dt)  // wrong-answer cooldown
              c. state dispatch:
                 MENU:      bob player, wait for flap → start
                 PLAYING:   full simulation (see below)
                 GAME_OVER: fall animation, wait for restart input
        7. render()
              a. compute math urgency (0-1)
              b. Renderer.render() → all sub-renderers
              c. sync answerRegions
```

### updatePlaying(dt) Detail

1. Consume flap → `player.flap()` (apply jump impulse)
2. Consume answer → `mathSystem.tryAnswer(index)`
   - Correct: screen flash, mark answered, update streak/multiplier, add P&L
   - Wrong: screen flash, deduct $50, reset streak
3. `player.update(dt, canvasHeight)` — gravity, velocity clamp, position, rotation
4. `gateManager.update(dt, w, h, score)` — scroll gates, recycle, spawn
5. Floor/ceiling collision check → die
6. Per-gate pipe collision (AABB) → die
7. Per-gate pass check:
   - If previous question unanswered → die
   - Otherwise: increment score, add P&L, play sound, generate new question

## Entity Design

### Player

Owns its own physics (gravity, jump impulse, terminal velocity, position clamping). `Physics.ts` is a thin wrapper that delegates to `Player.update()`.

Properties: `x`, `y`, `vy` (velocity), `rotation`, `width`, `height`

### Gate

Simple data container: `x`, `gapY`, `gapSize`, `passed`, `active`, `questionAnswered`, `priceLabel`

Methods: `init(x, gapY, gapSize, price)`, `deactivate()`, `getTopPipe()`, `getBottomPipe()`

### GateManager

Object pool pattern. Pre-allocates 6 `Gate` instances. Tracks `spawnTimer` and recycles gates that scroll off-screen. Spawning logic uses `SPACING_MIN_TIME` to ensure minimum distance between gates.

## Collision System

Pure AABB (Axis-Aligned Bounding Box) checks:

- `checkFloorCeiling(player, canvasHeight)` — top/bottom bounds
- `checkGateCollision(player, gate)` — tests against `gate.getTopPipe()` and `gate.getBottomPipe()` rectangles
- `checkGatePassed(player, gate)` — player.x crossed gate.x + PIPE_WIDTH

## State Machine

Simple enum-based state (`GameState.MENU | PLAYING | GAME_OVER`) with an additional `paused` boolean flag. State transitions:

```
MENU → PLAYING        (on flap input)
PLAYING → GAME_OVER   (on collision or unanswered question)
GAME_OVER → MENU      (on input after 1s delay, resets all state)
Any → paused          (tab hidden > 1s)
paused → resume       (on flap input)
```

## Canvas Rendering Pipeline

Each frame, renderers execute in this order (back to front):

1. **BackgroundRenderer** — clear canvas, grid lines, ticker tape
2. **GateRenderer** — pipes, dashed lines, price labels, gap glow
3. **PlayerRenderer** — candlestick body + wicks (with save/restore for rotation)
4. **HudRenderer** — P&L panel, high score panel
5. **MathOverlayRenderer** — question panel + answer buttons (when question is active)
6. **Flash overlay** — screen-wide transparent color rect (when flash timer > 0)
7. **Menu/GameOver/Pause overlays** — state-specific UI panels

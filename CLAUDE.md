# Stocky Bird

"Flappy Bird meets Bloomberg Terminal." A finance-themed arcade game where the player controls a candlestick through price-level gates while answering math questions under time pressure.

## Tech Stack

Next.js 16 + React 19 + TypeScript 5 + HTML5 Canvas 2D + Web Audio API — no game engine or audio libraries.

## File Structure

```
src/
  app/
    page.tsx              → Landing page, mounts <Game />
    layout.tsx            → Root layout (Geist Mono font)
    globals.css           → Full-viewport black canvas setup
  game/
    Game.tsx              → React shell: owns <canvas>, creates GameEngine in useEffect
    constants.ts          → ALL tuning values (physics, scoring, colors, etc.)
    engine/
      GameEngine.ts       → rAF loop, state machine, orchestrates everything
      AudioManager.ts     → Procedural sounds via Web Audio oscillators
      InputManager.ts     → Keyboard/mouse/touch, consume-once-per-frame pattern
    entities/
      Player.ts           → Candlestick bird (position, velocity, hitbox, physics)
      Gate.ts             → Single pipe pair (support/resistance level)
      GateManager.ts      → Object pool of 6 gates, spawning & recycling
      CandlestickTrail.ts → Scrolling candlestick chart trail behind player
    rendering/
      Renderer.ts         → Master dispatcher → sub-renderers below
      BackgroundRenderer.ts
      PlayerRenderer.ts
      GateRenderer.ts
      TrailRenderer.ts
      HudRenderer.ts
      MathOverlayRenderer.ts
    state/
      GameState.ts        → Enum: MENU | PLAYING | GAME_OVER
    systems/
      Collision.ts        → AABB floor/ceiling/pipe checks
      MathQuestion.ts     → Question generation (4 tiers) + answer logic
```

## Key Conventions

- **No game engine libs** — pure Canvas 2D API, all drawing is procedural (no sprites/images)
- **No audio files** — all sounds synthesized in real-time with Web Audio oscillators
- **Bloomberg aesthetic** — black bg, amber #FFA028 primary, Geist Mono font, financial theming throughout
- **React is just a mount point** — no React state during gameplay, everything is imperative
- **Constants are centralized** — `src/game/constants.ts` holds every tuning value
- **Object pooling** — GateManager pre-allocates 6 gates, no heap alloc during play
- **DPR-aware canvas** — scales by devicePixelRatio, draws in CSS-pixel coordinates

## How to Run

```sh
npm run dev
```

## Deeper Documentation

See `context/` folder for detailed docs:
- `context/OVERVIEW.md` — Game concept & theme
- `context/FEATURES.md` — Complete feature list
- `context/ARCHITECTURE.md` — Architecture, data flow, game loop
- `context/CONSTANTS.md` — All tuning values for quick reference

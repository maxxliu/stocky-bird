# Stocky Bird — Features

## Player (Candlestick)

- Rendered as a candlestick with body + upper/lower wicks
- **Green (bullish)** when velocity is negative (rising), **red (bearish)** when falling
- Glow effect via canvas shadowBlur
- Squash-and-stretch: rotation toward velocity direction (max 45°)
- Idle bobbing animation on menu screen (sinusoidal, 8px amplitude)
- Fixed horizontal position at 20% of canvas width

## Gates (Support/Resistance Levels)

- Styled as price support/resistance levels with dashed horizontal lines
- Price labels on each gate (starting at $100, drifting +$5 per gate)
- 8px-wide pipe bodies with gap between them
- Subtle glow fill in the gap area
- Object pool of 6 gates — no heap allocation during gameplay
- Gates scroll left at increasing speed

## Progressive Difficulty

- **Gap shrinks**: starts at 160px, decreases by 3px per gate cleared, minimum 100px
- **Speed increases**: starts at 120 px/s, increases by 4 px/s per gate, maximum 220 px/s
- **Math difficulty scales** with score (4 tiers — see Math section)

## Math Question System

- A question appears immediately after clearing each gate
- 4 multiple-choice answers in a 2×2 grid (bottom-right panel)
- Input via keyboard (1-4), mouse click, or touch tap
- **Must answer before reaching the next gate** — failure = instant death
- Wrong answer: 300ms lockout before the player can try again
- Distractor answers generated as near-miss values (±1) plus random offsets (±2 to ±5)

### Difficulty Tiers

| Score | Operations | Operand Range |
|-------|-----------|---------------|
| 0–4 | +, − | 1–10 |
| 5–9 | +, −, × | 1–12 |
| 10–19 | +, −, × | 5–25 (add/sub), 2–12 (multiply) |
| 20+ | Two-step: a×b+c or a×b−c | Mixed ranges |

## Math Urgency System

- Border color of the math overlay changes based on proximity to the next gate:
  - **Normal** (default panel border) when far away
  - **Orange (#FF8C00)** at >20% proximity
  - **Yellow (#FFD700)** at >40% proximity
  - **Red (#FF0000)** at >70% proximity
- Creates visual pressure to answer quickly

## Scoring / P&L System

- **TRADES**: integer count of gates cleared
- **P&L**: tracked in dollars
  - +$250 per gate cleared (base value × multiplier)
  - −$50 per wrong answer
- **Streak multiplier**: +10% per consecutive first-try correct answer, capped at 2.0×
  - Wrong answer resets streak and multiplier to 1×
- **High score**: persisted to localStorage (key: `stockybird_highscore`)

## Visual Feedback

- **Screen flashes**:
  - Green tint on correct answer (300ms)
  - Red tint on wrong answer (300ms)
  - Strong red on death (150ms)
- **Wrong answer lockout**: answer buttons turn dark red during 300ms lockout
- Flash timers managed in `Renderer.update(dt)`

## HUD

- **Top-left panel**: P&L (green if positive, red if negative), TRADES count, STREAK + multiplier
- **Top-right panel**: session high score
- **Bottom**: scrolling stock ticker tape at 35% opacity (25 real NASDAQ/NYSE symbols)

## Game States

| State | Description |
|-------|-------------|
| **MENU** | Bobbing candlestick, title "STOCKY BIRD / BLOOMBERG TERMINAL EDITION", flashing "PRESS SPACE TO TRADE" |
| **PLAYING** | Full game simulation |
| **GAME_OVER** | "TRADE REJECTED" overlay showing P&L, trades, accuracy %, session high. Player falls off screen. 1s delay before restart allowed. |
| **PAUSED** | "MARKET HALTED" overlay. Auto-triggers if tab hidden >1s. Resume on next flap input. |

## Input Support

- **Keyboard**: Space/ArrowUp to flap, keys 1-4 to select answer
- **Mouse**: click to flap (or select answer if clicking on answer button)
- **Touch**: tap to flap (or select answer)
- Consume-once-per-frame pattern ensures consistent input regardless of frame rate

## Background

- Scrolling vertical grid lines (parallax at 30 px/s)
- Static horizontal grid lines (40px spacing)
- Animated stock ticker tape across the bottom with real symbols and randomized prices/changes

## Audio (Procedural via Web Audio API)

All sounds synthesized in real-time — no audio files:

| Sound | Waveform | Frequency | Duration | Volume |
|-------|----------|-----------|----------|--------|
| Flap | Square | 440 Hz | 80ms | 0.06 |
| Score | Sine | 880 Hz | 100ms | 0.08 |
| Correct | Sine (two notes) | 523→659 Hz | 100ms apart | 0.08 |
| Wrong | Sawtooth | 200 Hz | 150ms | 0.08 |
| Death | Sawtooth | 400→80 Hz sweep | 400ms | 0.08 |

AudioContext created lazily on first user gesture (browser autoplay policy compliance).

## Responsive Design

- Canvas scales to fill the full viewport
- DPR-aware: `canvas.width = clientWidth × devicePixelRatio`
- Drawing coordinates remain in CSS pixels via `ctx.setTransform(dpr, ...)`
- Resize handled via ResizeObserver in Game.tsx

## Persistence

- High score saved to `localStorage` under key `stockybird_highscore`
- No other persistent state

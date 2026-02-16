# Stocky Bird — Constants Quick Reference

All values defined in `src/game/constants.ts`.

## Physics (`PHYSICS`)

| Constant | Value | Notes |
|----------|-------|-------|
| GRAVITY | 1200 px/s2 | Downward acceleration |
| JUMP_IMPULSE | -380 px/s | Negative = upward |
| TERMINAL_VELOCITY | 600 px/s | Max fall speed |
| MAX_DT | 0.05 s | Frame delta clamp (prevents spiral of death) |
| PAUSE_THRESHOLD | 1.0 s | Auto-pause if tab hidden longer than this |

## Player (`PLAYER`)

| Constant | Value | Notes |
|----------|-------|-------|
| WIDTH | 24 px | Candlestick body width |
| HEIGHT | 32 px | Candlestick body height |
| WICK_WIDTH | 2 px | Wick stroke width |
| WICK_EXTEND | 8 px | Wick extends above/below body |
| X_POSITION | 0.2 | Fixed at 20% of canvas width |
| BOB_AMPLITUDE | 8 px | Menu idle bob height |
| BOB_SPEED | 2 rad/s | Menu idle bob frequency |

## Gates (`GATES`)

| Constant | Value | Notes |
|----------|-------|-------|
| PIPE_WIDTH | 8 px | Width of pipe bodies |
| INITIAL_GAP | 160 px | Starting gap size |
| MIN_GAP | 100 px | Smallest gap |
| GAP_SHRINK_PER_SCORE | 3 px | Gap reduction per gate cleared |
| INITIAL_SPEED | 120 px/s | Starting scroll speed |
| MAX_SPEED | 220 px/s | Max scroll speed |
| SPEED_INCREASE | 4 px/s | Speed added per gate cleared |
| SPACING_PX | 600 px | Fixed pixel distance between gates |
| POOL_SIZE | 6 | Pre-allocated gate objects |
| EDGE_MARGIN | 60 px | Min distance from top/bottom for gap center |
| INITIAL_PRICE | 100 | Starting fake stock price |
| PRICE_DRIFT | 5 | Price increase per gate |

## Scoring (`SCORING`)

| Constant | Value | Notes |
|----------|-------|-------|
| BASE_VALUE | $250 | P&L per gate cleared (before multiplier) |
| WRONG_PENALTY | $50 | P&L deducted per wrong answer |
| STREAK_BONUS | 0.1 (10%) | Multiplier increase per consecutive first-try correct |
| MAX_MULTIPLIER | 2.0x | Multiplier cap |

## Math (`MATH`)

| Constant | Value | Notes |
|----------|-------|-------|
| WRONG_ANSWER_LOCKOUT | 300 ms | Cooldown after wrong answer |
| NUM_OPTIONS | 4 | Number of answer choices |

## Trail (`TRAIL`)

| Constant | Value | Notes |
|----------|-------|-------|
| INTERVAL | 0.15 s | Time between candle samples |
| CANDLE_WIDTH | 12 px | Width of each trail candle body |
| WICK_WIDTH | 1 px | Trail candle wick stroke width |
| MIN_BODY_HEIGHT | 2 px | Minimum candle body height |
| MAX_CANDLES | 60 | Maximum candles on screen |
| ALPHA | 0.65 | Trail opacity |
| GLOW_BLUR | 4 | Trail candle glow radius |

## Rendering (`RENDER`)

| Constant | Value | Notes |
|----------|-------|-------|
| GRID_SPACING | 40 px | Distance between grid lines |
| GRID_SCROLL_SPEED | 30 px/s | Vertical grid parallax speed |
| TICKER_SPEED | 60 px/s | Stock ticker scroll speed |
| TICKER_HEIGHT | 20 px | Ticker tape height |
| FONT | `'Geist Mono', 'Courier New', monospace` | Game font stack |

## Game Flow (`FLOW`)

| Constant | Value | Notes |
|----------|-------|-------|
| RESTART_DELAY | 1000 ms | Wait after death before restart allowed |
| DEATH_FLASH_DURATION | 150 ms | Red screen flash on death |
| CORRECT_FLASH_DURATION | 300 ms | Green screen flash on correct |
| WRONG_FLASH_DURATION | 300 ms | Red panel flash on wrong |

## Colors (`COLORS`)

| Key | Value | Purpose |
|-----|-------|---------|
| BG | `#000000` | Canvas background |
| GRID | `rgba(50,50,50,0.3)` | Grid lines |
| GRID_ACCENT | `rgba(50,50,50,0.5)` | Grid accent lines |
| PRIMARY | `#FFA028` | Bloomberg amber |
| ACCENT | `#4AF6C3` | Cyan/teal accent |
| BULLISH | `#00FF00` | Green (rising) |
| BEARISH | `#FF0000` | Red (falling) |
| WHITE | `#FFFFFF` | White |
| INFO | `#0068FF` | Blue info |
| TEXT | `#FFA028` | UI text (same as PRIMARY) |
| TEXT_DIM | `rgba(255,160,40,0.6)` | Dimmed text |
| PANEL_BG | `rgba(0,0,0,0.85)` | Panel backgrounds |
| PANEL_BORDER | `rgba(255,160,40,0.6)` | Panel borders |
| GATE_LINE | `rgba(255,160,40,0.4)` | Gate dashed lines |
| GATE_PIPE | `rgba(255,160,40,0.7)` | Gate pipe fill |
| GAP_GLOW | `rgba(74,246,195,0.08)` | Gap glow fill |
| URGENCY_ORANGE | `#FF8C00` | Math urgency tier 1 (>20%) |
| URGENCY_YELLOW | `#FFD700` | Math urgency tier 2 (>40%) |
| URGENCY_RED | `#FF0000` | Math urgency tier 3 (>70%) |
| CORRECT_FLASH | `rgba(0,255,0,0.15)` | Screen flash — correct |
| WRONG_FLASH | `rgba(255,0,0,0.15)` | Panel flash — wrong |
| DEATH_FLASH | `rgba(255,0,0,0.3)` | Screen flash — death |
| TICKER_TEXT | `rgba(255,160,40,0.35)` | Ticker tape text |

## Ticker Symbols (`TICKER_SYMBOLS`)

25 real symbols: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, JPM, V, JNJ, WMT, PG, UNH, HD, DIS, BAC, XOM, NFLX, COST, AMD, INTC, CRM, ORCL, CSCO, QCOM

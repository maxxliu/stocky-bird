// ── Colors ──────────────────────────────────────────
export const COLORS = {
  BG: '#000000',
  GRID: 'rgba(50,50,50,0.3)',
  GRID_ACCENT: 'rgba(50,50,50,0.5)',
  PRIMARY: '#FFA028',      // Bloomberg orange/amber
  ACCENT: '#4af6c3',       // Cyan/teal
  BULLISH: '#00FF00',      // Green - moving up
  BEARISH: '#FF0000',      // Red - moving down
  INFO: '#0068ff',         // Blue info
  TEXT: '#FFA028',
  TEXT_DIM: 'rgba(255,160,40,0.6)',
  PANEL_BG: 'rgba(0,0,0,0.85)',
  PANEL_BORDER: 'rgba(255,160,40,0.6)',
  WHITE: '#FFFFFF',
  GATE_LINE: 'rgba(255,160,40,0.4)',
  GATE_PIPE: 'rgba(255,160,40,0.7)',
  GAP_GLOW: 'rgba(74,246,195,0.08)',
  URGENCY_ORANGE: '#FF8C00',
  URGENCY_YELLOW: '#FFD700',
  URGENCY_RED: '#FF0000',
  CORRECT_FLASH: 'rgba(0,255,0,0.15)',
  WRONG_FLASH: 'rgba(255,0,0,0.15)',
  DEATH_FLASH: 'rgba(255,0,0,0.3)',
  TICKER_TEXT: 'rgba(255,160,40,0.35)',
} as const;

// ── Physics ─────────────────────────────────────────
export const PHYSICS = {
  GRAVITY: 1200,            // px/s^2
  JUMP_IMPULSE: -380,       // px/s (negative = upward)
  TERMINAL_VELOCITY: 600,   // px/s max fall speed
  MAX_DT: 0.05,             // 50ms max delta time
  PAUSE_THRESHOLD: 1.0,     // 1s dt triggers auto-pause
} as const;

// ── Player ──────────────────────────────────────────
export const PLAYER = {
  WIDTH: 24,
  HEIGHT: 32,
  WICK_WIDTH: 2,
  WICK_EXTEND: 8,           // How far wicks extend above/below body
  X_POSITION: 0.2,          // Fraction of canvas width
  BOB_AMPLITUDE: 8,         // Menu bob amplitude
  BOB_SPEED: 2,             // Menu bob speed
} as const;

// ── Gates ───────────────────────────────────────────
export const GATES = {
  PIPE_WIDTH: 8,
  INITIAL_GAP: 160,
  MIN_GAP: 100,
  GAP_SHRINK_PER_SCORE: 3,  // px per gate cleared
  INITIAL_SPEED: 120,       // px/s
  MAX_SPEED: 220,           // px/s
  SPEED_INCREASE: 4,        // px/s per gate cleared
  SPACING_PX: 600,          // Fixed pixel distance between gates
  POOL_SIZE: 6,
  EDGE_MARGIN: 60,          // Minimum gap distance from top/bottom
  INITIAL_PRICE: 100,
  PRICE_DRIFT: 5,           // Price increase per gate
} as const;

// ── Scoring ─────────────────────────────────────────
export const SCORING = {
  BASE_VALUE: 250,           // $ per gate cleared
  WRONG_PENALTY: 50,         // $ per wrong answer
  STREAK_BONUS: 0.1,         // 10% per consecutive first-try
  MAX_MULTIPLIER: 2.0,       // Cap on streak multiplier
} as const;

// ── Math Questions ──────────────────────────────────
export const MATH = {
  WRONG_ANSWER_LOCKOUT: 300, // ms lockout after wrong answer
  NUM_OPTIONS: 4,
} as const;

// ── Rendering ───────────────────────────────────────
export const RENDER = {
  GRID_SPACING: 40,          // px between grid lines
  GRID_SCROLL_SPEED: 30,     // px/s parallax
  TICKER_SPEED: 60,          // px/s
  TICKER_HEIGHT: 20,
  FONT: "'Geist Mono', 'Courier New', monospace",
} as const;

// ── Game Flow ───────────────────────────────────────
export const FLOW = {
  RESTART_DELAY: 1000,       // ms before restart allowed after death
  DEATH_FLASH_DURATION: 150, // ms
  CORRECT_FLASH_DURATION: 300,
  WRONG_FLASH_DURATION: 300,
} as const;

// ── Candlestick Trail ────────────────────────────────
export const TRAIL = {
  INTERVAL: 0.15,          // Seconds between trail candles
  CANDLE_WIDTH: 12,        // Trail candle body width (px)
  WICK_WIDTH: 1,           // Trail wick stroke width (px)
  MIN_BODY_HEIGHT: 2,      // Minimum body height for doji candles (px)
  MAX_CANDLES: 60,         // Max candles in memory
  ALPHA: 0.65,             // Trail opacity
  GLOW_BLUR: 4,            // Shadow blur (less than player's 12)
} as const;

// ── Ticker Symbols ──────────────────────────────────
export const TICKER_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM',
  'V', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'DIS', 'BAC', 'XOM',
  'NFLX', 'COST', 'AMD', 'INTC', 'CRM', 'ORCL', 'CSCO', 'QCOM',
] as const;

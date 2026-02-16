import { TRAIL } from '../constants';

export interface TrailCandle {
  x: number;        // screen-x position (scrolls left like gates)
  open: number;     // player y at interval start
  close: number;    // player y at interval end
  high: number;     // min y during interval (highest screen point)
  low: number;      // max y during interval (lowest screen point)
  isGreen: boolean; // close < open → player moved UP → green
}

export class CandlestickTrail {
  candles: TrailCandle[] = [];

  private timer = 0;
  private currentOpen = 0;
  private currentHigh = 0;
  private currentLow = 0;
  private active = false;

  reset() {
    this.candles.length = 0;
    this.timer = 0;
    this.active = false;
  }

  start(playerY: number) {
    this.active = true;
    this.timer = 0;
    this.currentOpen = playerY;
    this.currentHigh = playerY;
    this.currentLow = playerY;
  }

  update(dt: number, playerX: number, playerY: number, scrollSpeed: number) {
    if (!this.active) return;

    // Track extremes during this interval
    if (playerY < this.currentHigh) this.currentHigh = playerY;
    if (playerY > this.currentLow) this.currentLow = playerY;

    // Scroll existing candles left
    for (let i = this.candles.length - 1; i >= 0; i--) {
      this.candles[i].x -= scrollSpeed * dt;
      // Prune off-screen candles
      if (this.candles[i].x < -TRAIL.CANDLE_WIDTH) {
        this.candles.splice(i, 1);
      }
    }

    // Accumulate time
    this.timer += dt;
    if (this.timer >= TRAIL.INTERVAL) {
      this.timer -= TRAIL.INTERVAL;

      // Finalize current candle
      const candle: TrailCandle = {
        x: playerX,
        open: this.currentOpen,
        close: playerY,
        high: this.currentHigh,
        low: this.currentLow,
        isGreen: playerY < this.currentOpen, // moved up = green (lower y = higher on screen)
      };
      this.candles.push(candle);

      // Enforce max candles
      if (this.candles.length > TRAIL.MAX_CANDLES) {
        this.candles.shift();
      }

      // Start next interval — continuous chart
      this.currentOpen = playerY;
      this.currentHigh = playerY;
      this.currentLow = playerY;
    }
  }
}

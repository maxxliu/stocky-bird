import { TrailCandle } from '../entities/CandlestickTrail';
import { COLORS, TRAIL } from '../constants';

export class TrailRenderer {
  render(ctx: CanvasRenderingContext2D, candles: TrailCandle[]) {
    if (candles.length === 0) return;

    const savedAlpha = ctx.globalAlpha;
    ctx.globalAlpha = TRAIL.ALPHA;

    for (const c of candles) {
      const color = c.isGreen ? COLORS.BULLISH : COLORS.BEARISH;
      const borderColor = c.isGreen ? '#00cc00' : '#cc0000';
      const hw = TRAIL.CANDLE_WIDTH / 2;

      // Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = TRAIL.GLOW_BLUR;

      // Wick (high to low)
      ctx.strokeStyle = color;
      ctx.lineWidth = TRAIL.WICK_WIDTH;
      ctx.beginPath();
      ctx.moveTo(c.x, c.high);
      ctx.lineTo(c.x, c.low);
      ctx.stroke();

      // Body
      const top = Math.min(c.open, c.close);
      const bottom = Math.max(c.open, c.close);
      const bodyHeight = Math.max(bottom - top, TRAIL.MIN_BODY_HEIGHT);

      ctx.fillStyle = color;
      ctx.fillRect(c.x - hw, top, TRAIL.CANDLE_WIDTH, bodyHeight);

      // Body border
      ctx.shadowBlur = 0;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x - hw, top, TRAIL.CANDLE_WIDTH, bodyHeight);
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = savedAlpha;
  }
}

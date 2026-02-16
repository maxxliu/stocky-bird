import { COLORS, RENDER, SCORING } from '../constants';

export class HudRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    w: number,
    score: number,
    pnl: number,
    highScore: number,
    streak: number,
    multiplier: number,
  ) {
    // P&L panel (top left)
    this.renderPanel(ctx, 10, 10, 220, 70);

    ctx.font = `11px ${RENDER.FONT}`;
    ctx.textBaseline = 'top';

    // P&L value
    ctx.fillStyle = pnl >= 0 ? COLORS.BULLISH : COLORS.BEARISH;
    const pnlStr = `P&L: ${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    ctx.fillText(pnlStr, 20, 22);

    // Trades count
    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.fillText(`TRADES: ${score}`, 20, 40);

    // Streak / Multiplier
    if (streak > 0) {
      ctx.fillStyle = COLORS.ACCENT;
      ctx.fillText(`STREAK: ${streak} (${multiplier.toFixed(1)}x)`, 20, 56);
    }

    // High score (top right)
    const highText = `HI: $${highScore.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const highWidth = ctx.measureText(highText).width;
    this.renderPanel(ctx, w - highWidth - 40, 10, highWidth + 30, 32);
    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.fillText(highText, w - highWidth - 24, 20);
  }

  private renderPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = COLORS.PANEL_BG;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = COLORS.PANEL_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, w, h);
  }
}

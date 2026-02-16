import { COLORS, RENDER, TICKER_SYMBOLS } from '../constants';

export class BackgroundRenderer {
  private gridOffset = 0;
  private tickerOffset = 0;
  private tickerItems: { symbol: string; price: string; change: string; up: boolean }[] = [];

  constructor() {
    // Generate fake ticker data
    for (const sym of TICKER_SYMBOLS) {
      const price = (50 + Math.random() * 450).toFixed(2);
      const changePct = (Math.random() * 8 - 4).toFixed(2);
      this.tickerItems.push({
        symbol: sym,
        price,
        change: `${parseFloat(changePct) >= 0 ? '+' : ''}${changePct}%`,
        up: parseFloat(changePct) >= 0,
      });
    }
  }

  update(dt: number) {
    this.gridOffset = (this.gridOffset + RENDER.GRID_SCROLL_SPEED * dt) % RENDER.GRID_SPACING;
    this.tickerOffset = (this.tickerOffset + RENDER.TICKER_SPEED * dt);
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Black background
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, w, h);

    // Scrolling grid
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = -this.gridOffset; x < w; x += RENDER.GRID_SPACING) {
      const px = Math.floor(x) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }

    // Horizontal lines (static)
    for (let y = 0; y < h; y += RENDER.GRID_SPACING) {
      const py = Math.floor(y) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    // Ticker tape at bottom
    this.renderTicker(ctx, w, h);
  }

  private renderTicker(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const y = h - RENDER.TICKER_HEIGHT;

    // Ticker background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, y, w, RENDER.TICKER_HEIGHT);

    // Top border
    ctx.strokeStyle = COLORS.PANEL_BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(y) + 0.5);
    ctx.lineTo(w, Math.floor(y) + 0.5);
    ctx.stroke();

    ctx.font = `11px ${RENDER.FONT}`;
    ctx.textBaseline = 'middle';

    // Build ticker string and measure total width
    let totalWidth = 0;
    const segments: { text: string; color: string; width: number }[] = [];
    for (const item of this.tickerItems) {
      const text = ` ${item.symbol} ${item.price} ${item.change}  `;
      const width = ctx.measureText(text).width;
      segments.push({ text, color: item.up ? COLORS.BULLISH : COLORS.BEARISH, width });
      totalWidth += width;
    }

    if (totalWidth === 0) return;
    const offset = this.tickerOffset % totalWidth;
    let drawX = -offset;

    // Draw enough repetitions to fill screen
    while (drawX < w) {
      for (const seg of segments) {
        if (drawX + seg.width > 0 && drawX < w) {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = seg.color;
          ctx.fillText(seg.text, drawX, y + RENDER.TICKER_HEIGHT / 2);
          ctx.globalAlpha = 1;
        }
        drawX += seg.width;
      }
    }
  }
}

import { Gate } from '../entities/Gate';
import { COLORS, GATES, RENDER } from '../constants';

export class GateRenderer {
  render(ctx: CanvasRenderingContext2D, gates: Gate[], canvasHeight: number) {
    for (const gate of gates) {
      if (!gate.active) continue;
      this.renderGate(ctx, gate, canvasHeight);
    }
  }

  private renderGate(ctx: CanvasRenderingContext2D, gate: Gate, canvasHeight: number) {
    const x = Math.floor(gate.x) + 0.5;
    const pipeW = GATES.PIPE_WIDTH;

    // Gap glow
    ctx.fillStyle = COLORS.GAP_GLOW;
    ctx.fillRect(gate.x - pipeW * 3, gate.gapTop, pipeW * 6, gate.gapSize);

    // Dashed support/resistance lines across canvas
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;

    // Resistance line (top of gap)
    ctx.strokeStyle = COLORS.BEARISH;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(gate.gapTop) + 0.5);
    ctx.lineTo(gate.x - pipeW, Math.floor(gate.gapTop) + 0.5);
    ctx.stroke();

    // Support line (bottom of gap)
    ctx.strokeStyle = COLORS.BULLISH;
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(gate.gapBottom) + 0.5);
    ctx.lineTo(gate.x - pipeW, Math.floor(gate.gapBottom) + 0.5);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    // Pipe segments (vertical bars at gate position)
    ctx.fillStyle = COLORS.GATE_PIPE;

    // Top pipe
    ctx.fillRect(x - pipeW / 2, 0, pipeW, gate.gapTop);

    // Bottom pipe
    ctx.fillRect(x - pipeW / 2, gate.gapBottom, pipeW, canvasHeight - gate.gapBottom);

    // Pipe caps (slightly wider at gap edges)
    const capH = 4;
    const capW = pipeW + 6;
    ctx.fillStyle = COLORS.PRIMARY;

    // Top cap
    ctx.fillRect(x - capW / 2, gate.gapTop - capH, capW, capH);

    // Bottom cap
    ctx.fillRect(x - capW / 2, gate.gapBottom, capW, capH);

    // Price labels
    ctx.font = `10px ${RENDER.FONT}`;
    ctx.textBaseline = 'middle';

    // Resistance label
    ctx.fillStyle = COLORS.BEARISH;
    ctx.globalAlpha = 0.7;
    const rText = `R $${gate.priceResistance.toFixed(2)}`;
    ctx.fillText(rText, x + pipeW, gate.gapTop - 10);

    // Support label
    ctx.fillStyle = COLORS.BULLISH;
    const sText = `S $${gate.priceSupport.toFixed(2)}`;
    ctx.fillText(sText, x + pipeW, gate.gapBottom + 10);

    ctx.globalAlpha = 1;
  }
}

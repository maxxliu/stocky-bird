import { Player } from '../entities/Player';
import { COLORS, PLAYER } from '../constants';

export class PlayerRenderer {
  render(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);

    const w = PLAYER.WIDTH;
    const h = PLAYER.HEIGHT;
    const color = player.isGreen ? COLORS.BULLISH : COLORS.BEARISH;

    // Squash/stretch based on velocity
    const speedFactor = Math.abs(player.vy) / 400;
    const scaleX = 1 - speedFactor * 0.15;
    const scaleY = 1 + speedFactor * 0.15;
    ctx.scale(scaleX, scaleY);

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    // Wicks (thin lines above and below)
    ctx.strokeStyle = color;
    ctx.lineWidth = PLAYER.WICK_WIDTH;
    ctx.beginPath();
    // Top wick
    ctx.moveTo(0, -h / 2 - PLAYER.WICK_EXTEND);
    ctx.lineTo(0, -h / 2);
    // Bottom wick
    ctx.moveTo(0, h / 2);
    ctx.lineTo(0, h / 2 + PLAYER.WICK_EXTEND);
    ctx.stroke();

    // Body (filled rectangle)
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);

    // Body border
    ctx.strokeStyle = player.isGreen ? '#00cc00' : '#cc0000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-w / 2, -h / 2, w, h);

    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

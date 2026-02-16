import { Question } from '../systems/MathQuestion';
import { COLORS, RENDER } from '../constants';

export class MathOverlayRenderer {
  // Exposed for touch input hit-testing
  answerRegions: { x: number; y: number; w: number; h: number }[] = [];

  render(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    question: Question | null,
    lockoutActive: boolean,
    urgency: number, // 0-1, 1 = about to die
    wrongFlash: boolean,
    panelCenterX: number,
  ) {
    if (!question) {
      this.answerRegions = [];
      return;
    }

    const panelW = Math.min(320, w - 40);
    const panelH = 160;
    const panelX = Math.max(5, Math.min(w - panelW - 5, panelCenterX - panelW / 2));
    const panelY = (h - panelH) / 2;

    // Panel background
    ctx.fillStyle = COLORS.PANEL_BG;
    ctx.fillRect(panelX, panelY, panelW, panelH);

    // Urgency border color
    let borderColor: string = COLORS.PANEL_BORDER;
    if (urgency > 0.7) borderColor = COLORS.URGENCY_RED;
    else if (urgency > 0.4) borderColor = COLORS.URGENCY_YELLOW;
    else if (urgency > 0.2) borderColor = COLORS.URGENCY_ORANGE;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = urgency > 0.4 ? 2 : 1;
    ctx.strokeRect(Math.floor(panelX) + 0.5, Math.floor(panelY) + 0.5, panelW, panelH);

    // Wrong answer flash
    if (wrongFlash) {
      ctx.fillStyle = COLORS.WRONG_FLASH;
      ctx.fillRect(panelX, panelY, panelW, panelH);
    }

    // Question text
    ctx.font = `bold 14px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.WHITE;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(question.text, panelX + panelW / 2, panelY + 14);

    // Options in 2x2 grid
    const optW = (panelW - 30) / 2;
    const optH = 40;
    const startY = panelY + 48;
    const startX = panelX + 10;

    this.answerRegions = [];

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ox = startX + col * (optW + 10);
      const oy = startY + row * (optH + 8);

      this.answerRegions.push({ x: ox, y: oy, w: optW, h: optH });

      // Option background
      ctx.fillStyle = lockoutActive ? 'rgba(80,30,30,0.6)' : 'rgba(40,40,40,0.8)';
      ctx.fillRect(ox, oy, optW, optH);

      // Option border
      ctx.strokeStyle = lockoutActive ? 'rgba(255,0,0,0.4)' : COLORS.PANEL_BORDER;
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.floor(ox) + 0.5, Math.floor(oy) + 0.5, optW, optH);

      // Key number
      ctx.font = `bold 11px ${RENDER.FONT}`;
      ctx.fillStyle = COLORS.ACCENT;
      ctx.textAlign = 'left';
      ctx.fillText(`[${i + 1}]`, ox + 6, oy + 14);

      // Answer value
      ctx.font = `16px ${RENDER.FONT}`;
      ctx.fillStyle = COLORS.WHITE;
      ctx.textAlign = 'center';
      ctx.fillText(`${question.options[i]}`, ox + optW / 2 + 10, oy + 14);
    }

    ctx.textAlign = 'left';
  }
}

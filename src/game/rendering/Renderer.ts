import { BackgroundRenderer } from './BackgroundRenderer';
import { PlayerRenderer } from './PlayerRenderer';
import { GateRenderer } from './GateRenderer';
import { TrailRenderer } from './TrailRenderer';
import { HudRenderer } from './HudRenderer';
import { MathOverlayRenderer } from './MathOverlayRenderer';
import { Player } from '../entities/Player';
import { GateManager } from '../entities/GateManager';
import { CandlestickTrail } from '../entities/CandlestickTrail';
import { MathQuestionSystem } from '../systems/MathQuestion';
import { GameState } from '../state/GameState';
import { COLORS, RENDER, FLOW, SCORING } from '../constants';

export class Renderer {
  bg = new BackgroundRenderer();
  playerR = new PlayerRenderer();
  gateR = new GateRenderer();
  trailR = new TrailRenderer();
  hudR = new HudRenderer();
  mathR = new MathOverlayRenderer();

  private deathFlashTimer = 0;
  private correctFlashTimer = 0;
  private wrongFlashTimer = 0;

  triggerDeathFlash() { this.deathFlashTimer = FLOW.DEATH_FLASH_DURATION; }
  triggerCorrectFlash() { this.correctFlashTimer = FLOW.CORRECT_FLASH_DURATION; }
  triggerWrongFlash() { this.wrongFlashTimer = FLOW.WRONG_FLASH_DURATION; }

  update(dt: number) {
    this.bg.update(dt);
    if (this.deathFlashTimer > 0) this.deathFlashTimer -= dt * 1000;
    if (this.correctFlashTimer > 0) this.correctFlashTimer -= dt * 1000;
    if (this.wrongFlashTimer > 0) this.wrongFlashTimer -= dt * 1000;
  }

  render(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    state: GameState,
    player: Player,
    gateManager: GateManager,
    trail: CandlestickTrail,
    mathSystem: MathQuestionSystem,
    score: number,
    pnl: number,
    highScore: number,
    streak: number,
    multiplier: number,
    menuTime: number,
    restartReady: boolean,
    paused: boolean,
    urgency: number,
  ) {
    // Background
    this.bg.render(ctx, w, h);

    // Gates
    this.gateR.render(ctx, gateManager.gates, h);

    // Candlestick trail (between gates and player)
    if (state === GameState.PLAYING || state === GameState.GAME_OVER) {
      this.trailR.render(ctx, trail.candles);
    }

    // Player
    this.playerR.render(ctx, player);

    // Screen flashes
    if (this.deathFlashTimer > 0) {
      ctx.fillStyle = COLORS.DEATH_FLASH;
      ctx.fillRect(0, 0, w, h);
    }
    if (this.correctFlashTimer > 0) {
      ctx.fillStyle = COLORS.CORRECT_FLASH;
      ctx.fillRect(0, 0, w, h);
    }

    // State-specific overlays
    if (state === GameState.PLAYING) {
      this.hudR.render(ctx, w, score, pnl, highScore, streak, multiplier);
      this.mathR.render(ctx, w, h, mathSystem.currentQuestion, mathSystem.lockoutTimer > 0, urgency, this.wrongFlashTimer > 0);
    } else if (state === GameState.MENU) {
      this.renderMenu(ctx, w, h, menuTime);
    } else if (state === GameState.GAME_OVER) {
      this.renderGameOver(ctx, w, h, score, pnl, highScore, mathSystem, restartReady);
    }

    // Pause overlay
    if (paused) {
      this.renderPause(ctx, w, h);
    }
  }

  private renderMenu(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    // Title
    ctx.font = `bold 36px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.PRIMARY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = COLORS.PRIMARY;
    ctx.shadowBlur = 20;
    ctx.fillText('STOCKY BIRD', w / 2, h * 0.3);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.font = `14px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.ACCENT;
    ctx.fillText('BLOOMBERG TERMINAL EDITION', w / 2, h * 0.3 + 40);

    // Flashing start prompt
    if (Math.floor(time * 2.5) % 2 === 0) {
      ctx.font = `16px ${RENDER.FONT}`;
      ctx.fillStyle = COLORS.PRIMARY;
      ctx.fillText('PRESS SPACE TO TRADE', w / 2, h * 0.65);
    }

    // Instructions
    ctx.font = `11px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.fillText('SPACE / CLICK = FLAP  |  1-4 = ANSWER', w / 2, h * 0.75);
    ctx.fillText('CLEAR GATES & SOLVE MATH TO PROFIT', w / 2, h * 0.75 + 18);

    ctx.textAlign = 'left';
  }

  private renderGameOver(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    score: number,
    pnl: number,
    highScore: number,
    mathSystem: MathQuestionSystem,
    restartReady: boolean,
  ) {
    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, w, h);

    // Panel
    const panelW = Math.min(340, w - 40);
    const panelH = 240;
    const px = (w - panelW) / 2;
    const py = (h - panelH) / 2;

    ctx.fillStyle = COLORS.PANEL_BG;
    ctx.fillRect(px, py, panelW, panelH);
    ctx.strokeStyle = COLORS.BEARISH;
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Title
    ctx.font = `bold 22px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.BEARISH;
    ctx.fillText('TRADE REJECTED', w / 2, py + 18);

    // P&L
    ctx.font = `bold 18px ${RENDER.FONT}`;
    ctx.fillStyle = pnl >= 0 ? COLORS.BULLISH : COLORS.BEARISH;
    const pnlStr = `P&L: ${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    ctx.fillText(pnlStr, w / 2, py + 55);

    // Stats
    ctx.font = `13px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText(`TRADES: ${score}`, w / 2, py + 95);
    ctx.fillText(`ACCURACY: ${mathSystem.accuracy}%`, w / 2, py + 115);

    // High score
    ctx.fillStyle = COLORS.ACCENT;
    ctx.fillText(`SESSION HIGH: $${highScore.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, w / 2, py + 145);

    // Restart prompt
    if (restartReady) {
      ctx.font = `14px ${RENDER.FONT}`;
      ctx.fillStyle = COLORS.PRIMARY;
      if (Math.floor(Date.now() / 400) % 2 === 0) {
        ctx.fillText('PRESS SPACE TO RETRY', w / 2, py + 190);
      }
    }

    ctx.textAlign = 'left';
  }

  private renderPause(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `bold 24px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.URGENCY_YELLOW;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MARKET HALTED', w / 2, h / 2 - 15);

    ctx.font = `14px ${RENDER.FONT}`;
    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.fillText('CLICK TO RESUME', w / 2, h / 2 + 15);

    ctx.textAlign = 'left';
  }
}

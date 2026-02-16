import { Player } from '../entities/Player';
import { GateManager } from '../entities/GateManager';
import { CandlestickTrail } from '../entities/CandlestickTrail';
import { MathQuestionSystem } from '../systems/MathQuestion';
import { checkFloorCeiling, checkGateCollision, checkGatePassed } from '../systems/Collision';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Renderer } from '../rendering/Renderer';
import { GameState } from '../state/GameState';
import { PHYSICS, PLAYER, SCORING, FLOW, GATES } from '../constants';

const LS_KEY = 'stockybird_highscore';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputManager;
  private audio: AudioManager;
  private renderer: Renderer;

  private player: Player;
  private gateManager: GateManager;
  private trail: CandlestickTrail;
  private mathSystem: MathQuestionSystem;

  private state: GameState = GameState.MENU;
  private score = 0;
  private pnl = 0;
  private highScore = 0;
  private streak = 0;
  private multiplier = 1;

  private lastTime = 0;
  private menuTime = 0;
  private deathTimer = 0;
  private paused = false;

  private animFrameId = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;

  // Track which gate we need a question answered for
  private pendingQuestionGateIndex = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input = new InputManager(canvas);
    this.audio = new AudioManager();
    this.renderer = new Renderer();
    this.player = new Player();
    this.gateManager = new GateManager();
    this.trail = new CandlestickTrail();
    this.mathSystem = new MathQuestionSystem();

    // Load high score
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) this.highScore = parseFloat(saved);
    } catch { /* no localStorage */ }

    this.resize();
    this.player.reset(this.w, this.h);
  }

  resize() {
    this.dpr = window.devicePixelRatio || 1;
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    cancelAnimationFrame(this.animFrameId);
    this.input.destroy();
    this.audio.destroy();
  }

  private loop = (now: number) => {
    this.animFrameId = requestAnimationFrame(this.loop);

    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Auto-pause if tab was hidden
    if (dt > PHYSICS.PAUSE_THRESHOLD) {
      this.paused = true;
      dt = 0;
    }

    // Clamp dt
    if (dt > PHYSICS.MAX_DT) dt = PHYSICS.MAX_DT;

    // Handle pause
    if (this.paused) {
      if (this.input.consumeFlap()) {
        this.paused = false;
      }
      this.render();
      return;
    }

    this.update(dt);
    this.render();
  };

  private update(dt: number) {
    this.renderer.update(dt);
    this.mathSystem.updateLockout(dt * 1000);

    switch (this.state) {
      case GameState.MENU:
        this.updateMenu(dt);
        break;
      case GameState.PLAYING:
        this.updatePlaying(dt);
        break;
      case GameState.GAME_OVER:
        this.updateGameOver(dt);
        break;
    }
  }

  private updateMenu(dt: number) {
    this.menuTime += dt;

    // Bob player
    this.player.x = this.w * PLAYER.X_POSITION;
    this.player.y = this.h * 0.45 + Math.sin(this.menuTime * PLAYER.BOB_SPEED) * PLAYER.BOB_AMPLITUDE;
    this.player.rotation = 0;
    this.player.isGreen = true;

    if (this.input.consumeFlap()) {
      this.startGame();
    }
  }

  private startGame() {
    this.state = GameState.PLAYING;
    this.score = 0;
    this.pnl = 0;
    this.streak = 0;
    this.multiplier = 1;
    this.pendingQuestionGateIndex = -1;
    this.player.reset(this.w, this.h);
    this.player.flap();
    this.audio.flap();
    this.gateManager.reset(this.w);
    this.trail.reset();
    this.trail.start(this.player.y);
    this.mathSystem.reset();
  }

  private updatePlaying(dt: number) {
    // Input: flap
    if (this.input.consumeFlap()) {
      this.player.flap();
      this.audio.flap();
    }

    // Input: answer
    const answerKey = this.input.consumeAnswer();
    if (answerKey > 0 && this.mathSystem.isActive) {
      const result = this.mathSystem.tryAnswer(answerKey - 1);
      if (result === 'correct') {
        this.audio.correct();
        this.renderer.triggerCorrectFlash();
        // Mark the gate's question as answered
        const gate = this.findPendingQuestionGate();
        if (gate) gate.questionAnswered = true;
        this.pendingQuestionGateIndex = -1;
        // Streak: only increment if first-try correct (no wrong attempts this question)
        if (this.mathSystem.wrongAttempts === 0) {
          this.streak++;
          this.multiplier = Math.min(SCORING.MAX_MULTIPLIER, 1 + this.streak * SCORING.STREAK_BONUS);
        }
      } else if (result === 'wrong') {
        this.audio.wrong();
        this.renderer.triggerWrongFlash();
        this.pnl -= SCORING.WRONG_PENALTY;
        this.streak = 0;
        this.multiplier = 1;
      }
    }

    // Physics
    this.player.update(dt, this.h);

    // Gates
    this.gateManager.update(dt, this.w, this.h, this.score);

    // Trail
    this.trail.update(dt, this.player.x, this.player.y, this.gateManager.scrollSpeed);

    // Collision: floor/ceiling
    if (checkFloorCeiling(this.player, this.h)) {
      this.die();
      return;
    }

    // Collision: gates
    for (const gate of this.gateManager.gates) {
      if (!gate.active) continue;

      if (checkGateCollision(this.player, gate, this.h)) {
        this.die();
        return;
      }

      // Check if player passed through gate
      if (checkGatePassed(this.player, gate)) {
        gate.passed = true;

        // Check if previous question was unanswered
        if (this.mathSystem.isActive) {
          // Player reached next gate without answering - death
          this.die();
          return;
        }

        // Score
        this.score++;
        const bonus = SCORING.BASE_VALUE * this.multiplier;
        this.pnl += bonus;
        this.audio.score();

        // Generate new question
        this.mathSystem.generate(this.score);
        this.pendingQuestionGateIndex = this.gateManager.gates.indexOf(gate);

        // The question is for THIS gate - if answered before next gate, mark it
        // (we're tracking via mathSystem.isActive)
      }
    }

    // Sync answer regions for touch input
    this.input.answerRegions = this.renderer.mathR.answerRegions;
  }

  private findPendingQuestionGate(): import('../entities/Gate').Gate | null {
    if (this.pendingQuestionGateIndex >= 0 && this.pendingQuestionGateIndex < this.gateManager.gates.length) {
      return this.gateManager.gates[this.pendingQuestionGateIndex];
    }
    // Fallback: find the last passed gate that hasn't been answered
    for (const gate of this.gateManager.gates) {
      if (gate.active && gate.passed && !gate.questionAnswered) return gate;
    }
    return null;
  }

  private die() {
    this.state = GameState.GAME_OVER;
    this.deathTimer = 0;
    this.audio.death();
    this.renderer.triggerDeathFlash();

    // Update high score
    if (this.pnl > this.highScore) {
      this.highScore = this.pnl;
      try {
        localStorage.setItem(LS_KEY, this.highScore.toString());
      } catch { /* no localStorage */ }
    }
  }

  private updateGameOver(dt: number) {
    this.deathTimer += dt * 1000;

    // Player falls
    this.player.vy += PHYSICS.GRAVITY * dt;
    if (this.player.vy > PHYSICS.TERMINAL_VELOCITY) this.player.vy = PHYSICS.TERMINAL_VELOCITY;
    this.player.y += this.player.vy * dt;
    this.player.rotation += 3 * dt;
    this.player.isGreen = false;

    // Clamp to floor
    if (this.player.y > this.h + 50) {
      this.player.y = this.h + 50;
      this.player.vy = 0;
    }

    // Restart
    if (this.deathTimer > FLOW.RESTART_DELAY && this.input.consumeFlap()) {
      this.state = GameState.MENU;
      this.menuTime = 0;
      this.player.reset(this.w, this.h);
    }
  }

  private render() {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Calculate urgency for math overlay
    let urgency = 0;
    if (this.state === GameState.PLAYING && this.mathSystem.isActive) {
      const nextGate = this.gateManager.getNextGate(this.player.x);
      if (nextGate) {
        const dist = nextGate.x - this.player.x;
        const maxDist = this.w * 0.6;
        urgency = Math.max(0, Math.min(1, 1 - dist / maxDist));
      }
    }

    this.renderer.render(
      this.ctx,
      this.w,
      this.h,
      this.state,
      this.player,
      this.gateManager,
      this.trail,
      this.mathSystem,
      this.score,
      this.pnl,
      this.highScore,
      this.streak,
      this.multiplier,
      this.menuTime,
      this.deathTimer > FLOW.RESTART_DELAY,
      this.paused,
      urgency,
    );
  }
}

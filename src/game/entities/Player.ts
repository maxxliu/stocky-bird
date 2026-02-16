import { PHYSICS, PLAYER } from '../constants';

export class Player {
  x = 0;
  y = 0;
  vy = 0;              // vertical velocity px/s
  rotation = 0;        // radians
  isGreen = true;      // true = bullish (moving up), false = bearish

  reset(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth * PLAYER.X_POSITION;
    this.y = canvasHeight * 0.45;
    this.vy = 0;
    this.rotation = 0;
    this.isGreen = true;
  }

  flap() {
    this.vy = PHYSICS.JUMP_IMPULSE;
  }

  update(dt: number, canvasHeight: number) {
    // Apply gravity
    this.vy += PHYSICS.GRAVITY * dt;

    // Clamp to terminal velocity
    if (this.vy > PHYSICS.TERMINAL_VELOCITY) {
      this.vy = PHYSICS.TERMINAL_VELOCITY;
    }

    // Update position
    this.y += this.vy * dt;

    // Color based on velocity direction
    this.isGreen = this.vy < 0;
  }

  // Collision box (body only, no wicks)
  get hitbox() {
    return {
      x: this.x - PLAYER.WIDTH / 2,
      y: this.y - PLAYER.HEIGHT / 2,
      w: PLAYER.WIDTH,
      h: PLAYER.HEIGHT,
    };
  }
}

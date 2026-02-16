import { Player } from '../entities/Player';
import { Gate } from '../entities/Gate';
import { GATES, PLAYER } from '../constants';

interface AABB {
  x: number; y: number; w: number; h: number;
}

function intersects(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

export function checkFloorCeiling(player: Player, canvasHeight: number): boolean {
  const hb = player.hitbox;
  return hb.y < 0 || hb.y + hb.h > canvasHeight;
}

export function checkGateCollision(player: Player, gate: Gate, canvasHeight: number): boolean {
  if (!gate.active) return false;

  const hb = player.hitbox;
  const pipeW = GATES.PIPE_WIDTH;

  // Top pipe
  const topPipe: AABB = {
    x: gate.x - pipeW / 2,
    y: 0,
    w: pipeW,
    h: gate.gapTop,
  };

  // Bottom pipe
  const bottomPipe: AABB = {
    x: gate.x - pipeW / 2,
    y: gate.gapBottom,
    w: pipeW,
    h: canvasHeight - gate.gapBottom,
  };

  return intersects(hb, topPipe) || intersects(hb, bottomPipe);
}

export function checkGatePassed(player: Player, gate: Gate): boolean {
  // Player center passed gate x-position
  return !gate.passed && player.x > gate.x + GATES.PIPE_WIDTH / 2;
}

export function checkUnansweredDeath(player: Player, gate: Gate): boolean {
  // If player reaches a gate and previous question not answered
  return !gate.questionAnswered && player.x > gate.x - GATES.PIPE_WIDTH / 2 - PLAYER.WIDTH;
}

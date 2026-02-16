import { Gate } from './Gate';
import { GATES } from '../constants';

export class GateManager {
  gates: Gate[] = [];
  private currentPrice: number = GATES.INITIAL_PRICE;
  scrollSpeed: number = GATES.INITIAL_SPEED;

  constructor() {
    // Pre-allocate pool
    for (let i = 0; i < GATES.POOL_SIZE; i++) {
      this.gates.push(new Gate());
    }
  }

  reset(canvasWidth: number) {
    for (const g of this.gates) g.deactivate();
    this.scrollSpeed = GATES.INITIAL_SPEED;
    this.currentPrice = GATES.INITIAL_PRICE;
  }

  getGapSize(score: number): number {
    return Math.max(GATES.MIN_GAP, GATES.INITIAL_GAP - score * GATES.GAP_SHRINK_PER_SCORE);
  }

  getSpeed(score: number): number {
    return Math.min(GATES.MAX_SPEED, GATES.INITIAL_SPEED + score * GATES.SPEED_INCREASE);
  }

  update(dt: number, canvasWidth: number, canvasHeight: number, score: number) {
    this.scrollSpeed = this.getSpeed(score);
    const minSpacing = GATES.SPACING_PX;

    // Move active gates
    for (const g of this.gates) {
      if (!g.active) continue;
      g.x -= this.scrollSpeed * dt;

      // Recycle off-screen gates
      if (g.x < -GATES.PIPE_WIDTH * 2) {
        g.deactivate();
      }
    }

    // Spawn new gates
    const rightMostX = this.getRightMostGateX();
    const spawnThreshold = canvasWidth + 50;

    if (rightMostX < spawnThreshold - minSpacing) {
      const gate = this.getInactive();
      if (gate) {
        const gapSize = this.getGapSize(score);
        const minY = GATES.EDGE_MARGIN + gapSize / 2;
        const maxY = canvasHeight - GATES.EDGE_MARGIN - gapSize / 2;
        const gapCenterY = minY + Math.random() * (maxY - minY);

        this.currentPrice += GATES.PRICE_DRIFT * (0.5 + Math.random());
        const hasActive = this.gates.some(g => g.active && g !== gate);
        const spawnX = hasActive ? rightMostX + minSpacing : canvasWidth + 200;
        gate.init(spawnX, gapCenterY, gapSize, this.currentPrice);
      }
    }
  }

  private getRightMostGateX(): number {
    let maxX = -Infinity;
    for (const g of this.gates) {
      if (g.active && g.x > maxX) maxX = g.x;
    }
    return maxX;
  }

  private getInactive(): Gate | null {
    for (const g of this.gates) {
      if (!g.active) return g;
    }
    return null;
  }

  // Get the next upcoming gate (nearest active gate ahead of player)
  getNextGate(playerX: number): Gate | null {
    let nearest: Gate | null = null;
    let nearestDist = Infinity;
    for (const g of this.gates) {
      if (!g.active) continue;
      const dist = g.x - playerX;
      if (dist > -GATES.PIPE_WIDTH && dist < nearestDist) {
        nearestDist = dist;
        nearest = g;
      }
    }
    return nearest;
  }
}

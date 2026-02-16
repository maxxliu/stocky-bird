import { Player } from '../entities/Player';

export function updatePlayerPhysics(player: Player, dt: number, canvasHeight: number) {
  player.update(dt, canvasHeight);
}

import { Vector } from '../types/misc';
import { BLOCK } from './constants';

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coords(x: number, y: number) {
  return { x: BLOCK * x, y: BLOCK * y };
}

function nearestPoint(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  return {
    x: x2 + Math.cos(angle) * distance,
    y: y2 + Math.sin(angle) * distance,
  };
}

function calcDistances(v1: Vector, v2: Vector, width: number, height: number): { position: Vector; distance: number } {
  return [
    { position: v2, distance: calcDistance(v1, v2) }, // Top left
    { position: { ...v2, x: v2.x + width }, distance: calcDistance(v1, { ...v2, x: v2.x + width }) }, // Top right
    { position: { ...v2, y: v2.y + height }, distance: calcDistance(v1, { ...v2, y: v2.y + height }) }, // Bottom left
    {
      position: { x: v2.x + width, y: v2.y + height },
      distance: calcDistance(v1, { x: v2.x + width, y: v2.y + height }),
    }, // Bottom right
  ].sort((a, b) => a.distance - b.distance)[0];
}

function calcDistance(v1: Vector, v2: Vector) {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
export { randomNumber, coords, calcDistance, calcDistances, nearestPoint };

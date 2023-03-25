import { BLOCK, MAP_SIZE } from '../constants';

export default function drawGrid(ctx: CanvasRenderingContext2D) {
  for (let x = 0; x <= MAP_SIZE.Width * BLOCK; x += BLOCK) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, MAP_SIZE.Height * BLOCK);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#092a09';
    ctx.stroke();
  }
  for (let y = 0; y <= MAP_SIZE.Height * BLOCK; y += BLOCK) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(MAP_SIZE.Width * BLOCK, y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#092a09';
    ctx.stroke();
  }
}

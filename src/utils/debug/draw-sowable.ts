import data from '../../heat-maps/sowable.json';
import { BLOCK } from '../constants';
import { randomNumber } from '../functions';

const cell = getRandSowableCell();

function getRandSowableCell() {
  const index = randomNumber(0, data.length);

  return { x: data[index].x, y: data[index].y };
}

function drawSowable(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'red';
  ctx.globalAlpha = 0.1;
  ctx.fillRect(cell.x, cell.y, BLOCK, BLOCK);

  ctx.fillStyle = '#000';
  ctx.globalAlpha = 0.1;
  for (let j = 0; j < data.length; j++) {
    ctx.fillRect(data[j].x, data[j].y, BLOCK, BLOCK);
  }
}
export { drawSowable, cell };

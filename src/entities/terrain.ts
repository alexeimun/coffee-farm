import { Sprite } from './sprite';
import { ASSET_TYPE } from '../utils/constants';

type Vector = { x: number; y: number };

interface TerrainOptions {
  position: Vector;
  rotation?: number;
  scale?: number;
  animate?: boolean;
}

export class Terrain extends Sprite {
  constructor(imgSrc: string, { position, rotation = 0, scale = 1 }: TerrainOptions) {
    super(imgSrc, {
      position,
      rotation,
      scale,
      type: ASSET_TYPE.Terrain,
    });
  }
}

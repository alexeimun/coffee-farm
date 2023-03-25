import { ASSET_NAME, ASSET_TYPE } from '../utils/constants';
import { randomNumber } from '../utils/functions';

type Vector = { x: number; y: number };

export interface SpriteOptions {
  position?: Vector;
  frames?: {
    max: number;
    hold?: number;
    totalSprites?: number;
    position?: number;
    elapsed?: number;
    val?: number;
    random?: boolean;
  };
  animate?: boolean;
  rotation?: number;
  scale?: number;
  width?: number;
  height?: number;
  opacity?: number;
  filter?: string;
  name?: ASSET_NAME;
  type?: ASSET_TYPE;
}

export class Sprite implements SpriteOptions {
  private static idCounter = 1;
  position;
  image: HTMLImageElement;
  frames;
  animate?: boolean;
  rotation = 0;
  scale = 1;
  width = 0;
  height = 0;
  opacity = 1;
  filter = '';
  name;
  type;
  id: number;

  constructor(
    imgSrc: string,
    {
      position = { x: 0, y: 0 },
      frames = { max: 1 },
      animate = false,
      rotation = 0,
      scale = 1,
      type,
      name,
    }: SpriteOptions
  ) {
    this.position = position;
    this.image = new Image();
    this.image.src = `assets/${imgSrc}`;
    this.frames = { position: 0, totalSprites: 1, hold: 0, random: false, val: 0, elapsed: 0, ...frames };
    if (this.frames.random) {
      this.frames.val = randomNumber(0, this.frames.max - 1);
    }
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * scale;
      this.height = (this.image.height / this.frames.totalSprites) * scale;
    };
    this.animate = animate;
    this.opacity = 1;
    this.rotation = rotation;
    this.scale = scale;
    this.type = type;
    this.name = name;
    this.id = Sprite.idCounter++;
  }

  draw(c: CanvasRenderingContext2D) {
    c.save();
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
    c.globalAlpha = this.opacity;
    c.filter = this.filter;

    const crop = {
      position: {
        x: this.frames.val * (this.width / this.scale),
        y: this.frames.position * (this.height / this.scale),
      },
      width: this.image.width / this.frames.max,
      height: this.image.height / this.frames.totalSprites,
    };

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height / this.frames.totalSprites,
    };

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    );

    c.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

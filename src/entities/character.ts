import { Game } from '../game/game';
import { Sprite } from './sprite';
import {
  ASSET_NAME,
  ASSET_TYPE,
  BLOCK,
  CHARACTER_STATE,
  CHARACTER_TARGET,
  DIRECTION,
  VELOCITY,
} from '../utils/constants';
import { cell } from '../utils/debug/draw-sowable';
import { createAsset, getAssetsByName } from '../utils/sprite-repository';
import { calcDistances } from '../utils/functions';
import { Vector } from '../types/misc';

interface CharacterOptions {
  position: Vector;
  rotation?: number;
  scale?: number;
  animate?: boolean;
}

interface Task {
  time: number;
  text: string;
}

export class Character extends Sprite {
  private characterState: CHARACTER_STATE = CHARACTER_STATE.Moving;
  private characterTarget: CHARACTER_TARGET = CHARACTER_TARGET.Till;
  private timer: number = 0;
  private target: Vector = { x: 0, y: 0 };
  private task: Task = { time: 0, text: '' };

  constructor(imgSrc: string, { position, rotation = 0, scale = 1, animate = true }: CharacterOptions) {
    super(imgSrc, {
      position,
      rotation,
      scale,
      animate,
      type: ASSET_TYPE.Character,
      frames: { max: 4, totalSprites: 5, hold: 15 },
    });
    this.target = cell;
  }

  moveCharacter(ctx: CanvasRenderingContext2D) {
    this.updatePosition(0);
    if (this.position.x < this.target.x) {
      this.position.x += VELOCITY;
      this.frames.position = DIRECTION.Right;
    } else if (this.position.x > this.target.x) {
      this.position.x -= VELOCITY;
      this.frames.position = DIRECTION.Left;
    } else if (this.position.y < this.target.y) {
      this.position.y += VELOCITY;
      this.frames.position = DIRECTION.Down;
    } else if (this.position.y > this.target.y) {
      this.position.y -= VELOCITY;
      this.frames.position = DIRECTION.Up;
    } else {
      this.frames.position = DIRECTION.Idle;
      this.handleActivity(ctx);
    }

    this.updatePosition(this.id);
  }

  private updatePosition(id: number) {
    Game.instance().grid.updateGrid(
      (this.position.x - (this.position.x % BLOCK)) / BLOCK,
      (this.position.y - (this.position.y % BLOCK)) / BLOCK,
      1,
      1,
      id
    );
  }

  private handleActivity(ctx: CanvasRenderingContext2D) {
    if (this.characterState === CHARACTER_STATE.Moving) {
      if (this.characterTarget === CHARACTER_TARGET.Till) {
        this.task = { time: 2, text: 'Tilling' };
        this.timer = Date.now() + 1000 * this.task.time;
        this.changeState(CHARACTER_STATE.Tilling);
      } else if (this.characterTarget === CHARACTER_TARGET.Silo) {
        this.task = { time: 2, text: 'Getting seeds' };
        this.timer = Date.now() + 1000 * this.task.time;
        this.changeState(CHARACTER_STATE.AtSilo);
      } else if (this.characterTarget === CHARACTER_TARGET.Sow) {
        this.task = { time: 5, text: 'Planting' };
        this.changeState(CHARACTER_STATE.Sowing);
        this.timer = Date.now() + 1000 * this.task.time;
      }
    }

    if (this.hasState(CHARACTER_STATE.Idle)) {
      if (this.haTarget(CHARACTER_TARGET.Till) || this.haTarget(CHARACTER_TARGET.Sow)) {
        const silos = getAssetsByName(ASSET_NAME.Silo);
        if (!silos.length) {
          this.drawText(ctx, 'No silos found');
          return;
        }

        const silo = getAssetsByName(ASSET_NAME.Silo)
          .map(asset => ({
            ...asset,
            ...calcDistances(this.position, asset.position, asset.width, asset.height),
          }))
          .sort((a, b) => a.distance - b.distance)
          .shift();
        this.target = silo?.position!;

        this.setTarget(CHARACTER_TARGET.Silo);
      } else if (this.haTarget(CHARACTER_TARGET.Silo)) {
        this.target = cell;
        this.setTarget(CHARACTER_TARGET.Sow);
      }

      this.changeState(CHARACTER_STATE.Moving);
    } else {
      const tillingPctg = Math.min(1 - (this.timer - Date.now()) / (1000 * this.task.time), 1);
      if (tillingPctg === 1) {
        if (this.hasState(CHARACTER_STATE.Tilling)) {
          const asset = createAsset(ASSET_NAME.Tilled, { position: cell });
          Game.Terrains.push(asset);
        } else if (this.hasState(CHARACTER_STATE.Sowing)) {
          const asset = createAsset(ASSET_NAME.Sown, { position: cell });
          Game.Terrains.push(asset);
        }
        this.changeState(CHARACTER_STATE.Idle);
      }

      this.drawText(ctx, `${this.task.text} ${Math.round(tillingPctg * 100)}%`);
      this.drawProgresBar(ctx, tillingPctg);
    }
  }

  private drawText(ctx: CanvasRenderingContext2D, text: string) {
    ctx.font = '20px Press Start 2P';
    ctx.fillStyle = '#c4c4c4';
    ctx.fillText(text, this.position.x - (text.length / 2) * 2, this.position.y - 10);
  }

  private drawProgresBar(ctx: CanvasRenderingContext2D, tillingPctg: number) {
    ctx.beginPath();
    ctx.moveTo(this.position.x - 10, this.position.y - 5);
    ctx.lineTo(this.position.x + 30, this.position.y - 5);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c4c4c4';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.position.x - 10, this.position.y - 5);
    ctx.lineTo(this.position.x - 10 + tillingPctg * 40, this.position.y - 5);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3a7f2f';
    ctx.stroke();
  }

  setTarget(target: CHARACTER_TARGET) {
    this.characterTarget = target;
  }

  haTarget(target: CHARACTER_TARGET) {
    return this.characterTarget === target;
  }

  hasState(state: CHARACTER_STATE) {
    return this.characterState === state;
  }

  changeState(state: CHARACTER_STATE) {
    this.characterState = state;
  }
}

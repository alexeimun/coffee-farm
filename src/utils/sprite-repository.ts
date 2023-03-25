import { Game } from '../game/game';
import { Sprite, SpriteOptions } from '../entities/sprite';
import { ASSET_NAME, ASSET_TYPE } from './constants';

const Sprites: any = {
  [ASSET_NAME.Map]: {
    imgUrl: 'map.png',
    options: { type: ASSET_TYPE.Map },
  },
  [ASSET_NAME.ClockFrame]: {
    imgUrl: 'ui/click.png',
    options: { type: ASSET_TYPE.UI },
  },
  [ASSET_NAME.Principal]: {
    imgUrl: 'buildings/principal.png',
    options: { type: ASSET_TYPE.Building },
  },
  [ASSET_NAME.House1]: {
    imgUrl: 'buildings/house1.png',
    options: { type: ASSET_TYPE.Building },
  },
  [ASSET_NAME.House2]: {
    imgUrl: 'buildings/house2.png',
    options: { type: ASSET_TYPE.Building },
  },
  [ASSET_NAME.Silo]: {
    imgUrl: 'buildings/silo.png',
    options: { type: ASSET_TYPE.Building },
  },
  [ASSET_NAME.WaterDeposit]: {
    imgUrl: 'buildings/water-deposit.png',
    options: { type: ASSET_TYPE.Building, frames: { max: 2 } },
  },
  [ASSET_NAME.Dryer]: {
    imgUrl: 'buildings/dryer.png',
    options: { type: ASSET_TYPE.Building },
  },
  [ASSET_NAME.Tilled]: {
    imgUrl: 'terrain/tilled.png',
    options: { type: ASSET_TYPE.Terrain, frames: { max: 3, random: true } },
  },
  [ASSET_NAME.Sown]: {
    imgUrl: 'terrain/sown.png',
    options: { type: ASSET_TYPE.Terrain, frames: { max: 4, random: true } },
  },
  [ASSET_NAME.CoffeePlant]: {
    imgUrl: 'terrain/coffee-plant.png',
    options: { type: ASSET_TYPE.Plant, frames: { max: 4, random: true } },
  },
};

function createAsset(name: ASSET_NAME, options?: SpriteOptions): Sprite {
  return new Sprite(Sprites[name].imgUrl, { ...Sprites[name].options, ...options, name });
}

function getAssetById(spriteId: number): Sprite {
  return Game.Assets.find(({ id }) => id === spriteId)!;
}

function getAssetsByName(assetName: ASSET_NAME): Sprite[] {
  return Game.Assets.filter(({ name }) => name === assetName)!;
}

export { createAsset, getAssetById, getAssetsByName };

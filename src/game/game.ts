import { SpriteOptions, Sprite } from '../entities/sprite';
import { Grid } from '../utils/grid';
import { ASSET_NAME } from '../utils/constants';
import { createAsset } from '../utils/sprite-repository';
import { coords } from '../utils/functions';
import { Character } from '../entities/character';
import { Terrain } from '../entities/terrain';

export class Game {
  private static self: Game | null = null;
  placeableAsset: Sprite | null = null;
  grid: Grid;

  static Map = createAsset(ASSET_NAME.Map, { position: coords(0, 0) });

  static Assets: Sprite[] = [];

  static Characters: Character[] = [
    new Character('humans/human1.png', {
      position: coords(32, 20),
    }),
  ];

  static Terrains: Terrain[] = [
    createAsset(ASSET_NAME.Tilled, { position: coords(36, 17) }),
    createAsset(ASSET_NAME.Tilled, { position: coords(37, 17) }),
    createAsset(ASSET_NAME.Tilled, { position: coords(36, 18) }),
    createAsset(ASSET_NAME.Tilled, { position: coords(37, 18) }),

    createAsset(ASSET_NAME.Sown, { position: coords(36, 17) }),
    createAsset(ASSET_NAME.Sown, { position: coords(37, 17) }),
    createAsset(ASSET_NAME.Sown, { position: coords(36, 18) }),
    createAsset(ASSET_NAME.Sown, { position: coords(37, 18) }),

    createAsset(ASSET_NAME.CoffeePlant, { position: coords(36, 17) }),
    createAsset(ASSET_NAME.CoffeePlant, { position: coords(37, 17) }),
    createAsset(ASSET_NAME.CoffeePlant, { position: coords(36, 18) }),
    createAsset(ASSET_NAME.CoffeePlant, { position: coords(37, 18) }),
  ];
  // static UI: Sprite[] = [createAsset(ASSET_NAME.ClockFrame, { position: coords(MAP_SIZE.Width / 2, 1) })];

  constructor() {
    this.grid = new Grid();
  }

  addPlaceableAsset(assetName: ASSET_NAME, options?: SpriteOptions) {
    this.placeableAsset = createAsset(assetName, options);
  }

  setPlaceableAsset() {
    if (this.placeableAsset) {
      Game.Assets.push(this.placeableAsset);
      this.placeableAsset = null;
    }
  }

  static draw(ctx: CanvasRenderingContext2D) {
    this.Map.draw(ctx);
    this.Terrains.forEach(terrain => terrain.draw(ctx));
    this.Assets.forEach(asset => asset.draw(ctx));
    this.Characters.forEach(cahracter => {
      cahracter.draw(ctx);
      cahracter.moveCharacter(ctx);
    });
  }

  static instance() {
    if (!this.self) {
      this.self = new Game();
    }
    return this.self;
  }
}

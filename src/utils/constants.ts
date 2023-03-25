const BLOCK = 16;
const VELOCITY = 1;
const MAX_ZOOM = 2.5;
const MIN_ZOOM = 1.5;
const SCROLL_SENSITIVITY = 0.0005;
const MAP_SIZE = {
  Width: 70,
  Height: 40,
};
const enum DIRECTION {
  Idle,
  Right,
  Left,
  Down,
  Up,
}
const enum ASSET_TYPE {
  Map,
  UI,
  Building,
  Character,
  Terrain,
  Plant,
}
const enum ASSET_NAME {
  Map = 'Map',
  WaterDeposit = 'WaterStorage',
  Character1 = 'Character1',
  House1 = 'House1',
  House2 = 'House2',
  Principal = 'Principal',
  Silo = 'Silo',
  Dryer = 'Dryer',
  Tilled = 'Tilled',
  Sown = 'Sown',
  CoffeePlant = 'CoffeePlant',
}
const enum CHARACTER_STATE {
  Idle,
  Moving,
  AtSilo,
  Tilling,
  Sowing,
}

const enum CHARACTER_TARGET {
  Till,
  Silo,
  Sow,
}
export {
  BLOCK,
  VELOCITY,
  MAX_ZOOM,
  MIN_ZOOM,
  SCROLL_SENSITIVITY,
  DIRECTION,
  MAP_SIZE,
  ASSET_NAME,
  ASSET_TYPE,
  CHARACTER_STATE,
  CHARACTER_TARGET,
};

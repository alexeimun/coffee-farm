import { useState } from 'react';
import './Toolbar.scss';
import classnames from 'classnames';
import PlaceableItem from '../PlaceableItem/PlaceableItem';
import { ASSET_NAME } from '../../utils/constants';
import { SpriteOptions } from '../../entities/sprite';

const placeables = [
  { imgSrc: 'assets/buildings/house1.png', title: 'House', assetName: ASSET_NAME.House1 },
  { imgSrc: 'assets/buildings/silo.png', title: 'Silo', assetName: ASSET_NAME.Silo },
  { imgSrc: 'assets/buildings/house2.png', title: 'House 2', assetName: ASSET_NAME.House2 },
  { imgSrc: 'assets/buildings/dryer.png', title: 'Dryer', assetName: ASSET_NAME.Dryer },
  {
    imgSrc: 'assets/buildings/water-deposit.png',
    title: 'Water deposit',
    assetName: ASSET_NAME.WaterDeposit,
    options: { frame: {} } as SpriteOptions,
  },
];

export default function Toolbar() {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="bottom-toolbar-container flex flex-column">
      <div className="toolbar-top" />
      <div className="toolbar-items">
        <div className="toolbar-item flex" onClick={() => setIsOpened(!isOpened)}>
          <img src="assets/ui/hammer.png" />
        </div>
        <div className="toolbar-item flex">
          <img src="assets/ui/remove.png" />
        </div>
        <div className={classnames('build-menu-popup pixel-border', { hidden: !isOpened })}>
          <div className="placeable-container">
            {placeables.map((placeable, index) => (
              <PlaceableItem key={index} {...placeable} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

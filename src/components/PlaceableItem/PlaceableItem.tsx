import { ASSET_NAME } from '../../utils/constants';
import { Game } from '../../game/game';
import './PlaceableItem.scss';
import { SpriteOptions } from '../../entities/sprite';

export default function PlaceableItem({
  imgSrc,
  title,
  assetName,
  options,
}: {
  imgSrc: string;
  title: string;
  assetName: ASSET_NAME;
  options?: SpriteOptions;
}) {
  return (
    <div
      className="placeable-item flex flex-column"
      onClick={() => {
        Game.instance().addPlaceableAsset(assetName, options);
      }}
    >
      <img src={imgSrc} />
      <p>{title}</p>
    </div>
  );
}

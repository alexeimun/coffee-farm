import classnames from 'classnames';
import { Sprite } from '../../entities/sprite';
import './Sidebar.scss';

export default function Sidebar({
  isOpened,
  sprite,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: any;
  sprite: Sprite;
}) {
  return (
    <div className={classnames('sidebar-container flex-column pixel-border', { hidden: !isOpened })}>
      <span className="close-sidebar" onClick={() => setIsOpened(false)}>
        &times;
      </span>
      <img src={sprite?.image?.src} width={sprite.width} />
      <p>{sprite.name}</p>
    </div>
  );
}

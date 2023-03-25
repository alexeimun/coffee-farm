import { useEffect, useState } from 'react';
import { getCurrentTime } from '../../utils/time';
import './ToolbarRight.scss';

export default function ToolbarRight() {
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  return (
    <div className="bottom-right-toolbar-container flex flex-column">
      <div className="toolbar-top" />
      <div className="toolbar-items">
        <div className="toolbar-item flex">
          <span className="time">{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

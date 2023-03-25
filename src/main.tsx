import React from 'react';
import ReactDOM from 'react-dom/client';
import GameApp from './GameApp';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('game') as HTMLElement).render(
  <React.StrictMode>
    <GameApp />
  </React.StrictMode>
);

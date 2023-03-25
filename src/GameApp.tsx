import { useEffect, useRef, useState } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import drawGrid from './utils/debug/draw-grid';
import { Game } from './game/game';
import { BLOCK, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY } from './utils/constants';
import { drawSowable } from './utils/debug/draw-sowable';
import { getAssetById } from './utils/sprite-repository';
import Sidebar from './components/Sidebar/Sidebar';
import { Sprite } from './entities/sprite';
import ToolbarRight from './components/ToolbarRight/ToolbarRight';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let cameraZoom = MIN_ZOOM;
let placeablePos = { x: 0, y: 0 };
let mainGameId: any = null;
let spriteId: number = 0;
const cameraOffset = { x: 0, y: 0 };

export default function GameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvas = canvasRef.current!;
    ctx = canvas.getContext('2d')!;

    function draw() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.translate(cameraOffset.x, cameraOffset.y);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.scale(cameraZoom, cameraZoom);

      Game.draw(ctx);
      // Click on sprite
      spriteId = Game.instance().grid.getCell(placeablePos.x / BLOCK, placeablePos.y / BLOCK);
      if (spriteId > 0) {
        document.body.style.cursor = 'pointer';
      } else if (document.body.style.cursor === 'pointer') {
        document.body.style.cursor = 'default';
      }

      const placeableAsset = Game.instance().placeableAsset!;
      if (placeableAsset) {
        placeableAsset.position = {
          x: placeablePos.x - placeableAsset.width / 2,
          y: placeablePos.y - placeableAsset.height / 2,
        };
        placeableAsset.filter = isPlaceable() ? '' : `drop-shadow(1px 1px 10px red`;
        placeableAsset.draw(ctx);
        drawGrid(ctx);
      }
      // Debugger
      // drawSowable(ctx);
      mainGameId = requestAnimationFrame(draw);
    }

    function isPlaceable(): boolean {
      const placeableAsset = Game.instance().placeableAsset!;

      return (
        Game.instance().placeableAsset! &&
        Game.instance().grid.isPlaceable(
          Math.ceil((placeablePos.x - placeableAsset.width / 2) / BLOCK),
          Math.ceil((placeablePos.y - placeableAsset.height / 2) / BLOCK),
          placeableAsset.width / BLOCK,
          placeableAsset.height / BLOCK
        )
      );
    }

    // Gets the relevant location from a mouse or single touch event
    function getEventLocation(e: TouchEvent | MouseEvent): { x: number; y: number } {
      if (e instanceof TouchEvent && e.touches.length === 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e instanceof MouseEvent && e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
      }
      return { x: 0, y: 0 };
    }

    let isDragging = false;
    const dragStart = { x: 0, y: 0 };

    function onPointerDown(e: MouseEvent) {
      isDragging = true;
      dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
      dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;

      if (spriteId > 0) {
        const sprite = getAssetById(spriteId);
        setIsOpened(true);
        setSprite(sprite);
      }

      if (isPlaceable()) {
        const placeableAsset = Game.instance().placeableAsset!;

        Game.instance().grid.updateGrid(
          Math.ceil((placeablePos.x - placeableAsset.width / 2) / BLOCK),
          Math.ceil((placeablePos.y - placeableAsset.height / 2) / BLOCK),
          placeableAsset.width / BLOCK,
          placeableAsset.height / BLOCK,
          placeableAsset.id
        );
        Game.instance().setPlaceableAsset();
      }
    }

    function onPointerUp() {
      isDragging = false;
      initialPinchDistance = null;
      lastZoom = cameraZoom;
    }

    function onPointerMove(e: MouseEvent) {
      if (isDragging) {
        const { x, y } = getEventLocation(e);
        cameraOffset.x = x / cameraZoom - dragStart.x;
        cameraOffset.y = y / cameraZoom - dragStart.y;
      }
      getCursorPosition(e);
    }

    function handleTouch(e: TouchEvent, singleTouchHandler: any) {
      if (e.touches.length === 1) {
        singleTouchHandler(e);
      } else if (e.type === 'touchmove' && e.touches.length === 2) {
        isDragging = false;
        handlePinch(e);
      }
    }

    let initialPinchDistance: number | null = null;
    let lastZoom = cameraZoom;

    function handlePinch(e: TouchEvent) {
      e.preventDefault();

      const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      const currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

      if (initialPinchDistance === null) {
        initialPinchDistance = currentDistance;
      } else {
        adjustZoom(null, currentDistance / initialPinchDistance);
      }
    }

    function adjustZoom(zoomAmount: number | null, zoomFactor?: number) {
      if (!isDragging) {
        if (zoomAmount && cameraZoom) {
          cameraZoom += zoomAmount;
        } else if (zoomFactor) {
          cameraZoom = zoomFactor * lastZoom;
        }

        cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
        cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
      }
    }

    const getCursorPosition = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      const x = Math.round((event.clientX - rect.left - cameraOffset.x) / cameraZoom);
      const y = Math.round((event.clientY - rect.top - cameraOffset.y) / cameraZoom);
      placeablePos = { x: x - (x % BLOCK), y: y - (y % BLOCK) };
    };

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('touchstart', (e: TouchEvent) => handleTouch(e, onPointerDown));
    canvas.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchend', e => handleTouch(e, onPointerUp));
    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('touchmove', e => handleTouch(e, onPointerMove));
    canvas.addEventListener('wheel', e => adjustZoom(e.deltaY * SCROLL_SENSITIVITY));

    draw();
    return () => {
      window.cancelAnimationFrame(mainGameId);
    };
  }, []);

  const [isOpened, setIsOpened] = useState(false);
  const [sprite, setSprite] = useState<Sprite>({} as Sprite);
  return (
    <>
      <canvas ref={canvasRef} />
      <Sidebar isOpened={isOpened} setIsOpened={setIsOpened} sprite={sprite} />
      <Toolbar />
      <ToolbarRight />
    </>
  );
}

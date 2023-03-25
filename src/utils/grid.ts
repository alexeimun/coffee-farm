import { MAP_SIZE } from './constants';

export class Grid {
  private grid: number[][] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < MAP_SIZE.Height; i++) {
      this.grid[i] = [];
      for (let j = 0; j < MAP_SIZE.Width; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  updateGrid(x: number, y: number, width: number, height: number, id: number) {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        this.grid[i][j] = id;
      }
    }
  }

  isPlaceable(x: number, y: number, width: number, height: number) {
    if (x < 0 || y < 0 || x + width > MAP_SIZE.Width || y + height > MAP_SIZE.Height) return false;
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (this.grid[i][j] > 0) {
          return false;
        }
      }
    }
    return true;
  }

  getCell(x: number, y: number) {
    if (x < 0 || y < 0 || x >= MAP_SIZE.Width || y >= MAP_SIZE.Height) return 0;
    return this.grid[y][x];
  }

  printGrid() {
    console.log(this.grid);
  }
}

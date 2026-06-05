class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelId = data.levelId || 1;
    this.cellSize = 60;
    this.gridSize = 6;
    this.animals = new Map();
    this.occupancyGrid = [];
    this.moveCount = 0;
    this.history = [];
    this.selectedAnimal = null;
    this.dragStartPointer = null;
    this.dragStartCell = null;
    this.isDragging = false;
    this.isAnimating = false;
  }

  preload() {}

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    const totalGridPx = this.gridSize * this.cellSize; // 360
    this.gridOffsetX = (W - totalGridPx) / 2;          // 20
    this.gridOffsetY = 120;

    this._initOccupancyGrid();
    this._drawBackground(W, H);
    this._drawGrid();
    this._createUI(W);
    this._loadLevel();
    this._setupInput();
  }

  _initOccupancyGrid() {
    this.occupancyGrid = [];
    for (let r = 0; r < this.gridSize; r++) {
      this.occupancyGrid.push(new Array(this.gridSize).fill(null));
    }
  }

  _drawBackground(W, H) {
    const bg = this.add.graphics();
    bg.fillStyle(0x3a7a30, 1);
    bg.fillRect(0, 0, W, H);

    // Subtle grass patches
    bg.fillStyle(0x4a8a40, 0.3);
    for (let i = 0; i < 15; i++) {
      const gx = (i * 67 + 23) % W;
      const gy = (i * 83 + 41) % H;
      bg.fillEllipse(gx, gy, 50 + (i * 11) % 30, 25 + (i * 7) % 15);
    }
  }

  _drawGrid() {
    const cs = this.cellSize;
    const ox = this.gridOffsetX;
    const oy = this.gridOffsetY;
    const gs = this.gridSize;

    const gridGraphics = this.add.graphics();

    // Cell backgrounds (alternating shades)
    for (let r = 0; r < gs; r++) {
      for (let c = 0; c < gs; c++) {
        const shade = (r + c) % 2 === 0 ? 0x6aaa58 : 0x5a9a48;
        gridGraphics.fillStyle(shade, 1);
        gridGraphics.fillRect(ox + c * cs + 1, oy + r * cs + 1, cs - 2, cs - 2);
      }
    }

    // Fence-style grid lines
    gridGraphics.lineStyle(2, 0x3a5a28, 1);
    for (let i = 0; i <= gs; i++) {
      gridGraphics.lineBetween(ox + i * cs, oy, ox + i * cs, oy + gs * cs);
      gridGraphics.lineBetween(ox, oy + i * cs, ox + gs * cs, oy + i * cs);
    }

    // Outer border (thicker fence)
    gridGraphics.lineStyle(4, 0x2a4a18, 1);
    // Top border (with gap for top exit: cols 2-3)
    gridGraphics.lineBetween(ox, oy, ox + 2 * cs, oy);
    gridGraphics.lineBetween(ox + 4 * cs, oy, ox + gs * cs, oy);
    // Bottom border (with gap for bottom exit: cols 2-3)
    gridGraphics.lineBetween(ox, oy + gs * cs, ox + 2 * cs, oy + gs * cs);
    gridGraphics.lineBetween(ox + 4 * cs, oy + gs * cs, ox + gs * cs, oy + gs * cs);
    // Left border (with gap for left exit: rows 2-3)
    gridGraphics.lineBetween(ox, oy, ox, oy + 2 * cs);
    gridGraphics.lineBetween(ox, oy + 4 * cs, ox, oy + gs * cs);
    // Right border (with gap for right exit: rows 2-3)
    gridGraphics.lineBetween(ox + gs * cs, oy, ox + gs * cs, oy + 2 * cs);
    gridGraphics.lineBetween(ox + gs * cs, oy + 4 * cs, ox + gs * cs, oy + gs * cs);

    this._drawExitArrows(gridGraphics);
  }

  _drawExitArrows(g) {
    const cs = this.cellSize;
    const ox = this.gridOffsetX;
    const oy = this.gridOffsetY;
    const gs = this.gridSize;
    const arrowColor = 0xffffff;
    const arrowAlpha = 0.8;
    const gapCenter = 3 * cs; // center of 2-cell gap (cols/rows 2-3)

    g.fillStyle(arrowColor, arrowAlpha);

    // Top exit arrow (pointing up)
    const tx = ox + gapCenter;
    g.fillTriangle(tx - 10, oy - 8, tx + 10, oy - 8, tx, oy - 22);

    // Bottom exit arrow (pointing down)
    const bx = ox + gapCenter;
    const by = oy + gs * cs;
    g.fillTriangle(bx - 10, by + 8, bx + 10, by + 8, bx, by + 22);

    // Left exit arrow (pointing left)
    const ly = oy + gapCenter;
    g.fillTriangle(ox - 8, ly - 10, ox - 8, ly + 10, ox - 22, ly);

    // Right exit arrow (pointing right)
    const rx = ox + gs * cs;
    const ry = oy + gapCenter;
    g.fillTriangle(rx + 8, ry - 10, rx + 8, ry + 10, rx + 22, ry);
  }

  _createUI(W) {
    const levelData = LEVELS[this.levelId - 1];

    // Header background
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x1a4a18, 0.85);
    headerBg.fillRect(0, 0, W, 110);

    // Level label
    this.add.text(16, 14, `Level ${this.levelId}`, {
      fontSize: '22px', fontFamily: 'Arial', color: '#ffffff',
      fontStyle: 'bold', stroke: '#1a4a18', strokeThickness: 3
    });

    this.add.text(16, 40, levelData.theme, {
      fontSize: '13px', fontFamily: 'Arial', color: '#aaddaa'
    });

    // Move counter
    this.moveText = this.add.text(W / 2, 20, 'Moves: 0', {
      fontSize: '20px', fontFamily: 'Arial', color: '#ffffff',
      fontStyle: 'bold', stroke: '#1a4a18', strokeThickness: 3
    }).setOrigin(0.5, 0);

    // Undo button
    const undoBg = this.add.graphics();
    undoBg.fillStyle(0x4a7a30, 1);
    undoBg.fillRoundedRect(W - 80, 12, 68, 36, 8);
    undoBg.lineStyle(2, 0x8ab870, 1);
    undoBg.strokeRoundedRect(W - 80, 12, 68, 36, 8);

    this.undoText = this.add.text(W - 46, 30, '↩ Undo', {
      fontSize: '14px', fontFamily: 'Arial', color: '#ffffff'
    }).setOrigin(0.5);

    const undoZone = this.add.zone(W - 80, 12, 68, 36).setOrigin(0).setInteractive({ useHandCursor: true });
    undoZone.on('pointerup', () => this._undo());
    undoZone.on('pointerover', () => {
      undoBg.clear();
      undoBg.fillStyle(0x6a9a50, 1);
      undoBg.fillRoundedRect(W - 80, 12, 68, 36, 8);
      undoBg.lineStyle(2, 0xffffff, 0.6);
      undoBg.strokeRoundedRect(W - 80, 12, 68, 36, 8);
    });
    undoZone.on('pointerout', () => {
      undoBg.clear();
      undoBg.fillStyle(0x4a7a30, 1);
      undoBg.fillRoundedRect(W - 80, 12, 68, 36, 8);
      undoBg.lineStyle(2, 0x8ab870, 1);
      undoBg.strokeRoundedRect(W - 80, 12, 68, 36, 8);
    });

    // Menu button
    const menuBg = this.add.graphics();
    menuBg.fillStyle(0x2a5a18, 1);
    menuBg.fillRoundedRect(16, 60, 60, 32, 6);
    this.add.text(46, 76, '≡ Menu', {
      fontSize: '12px', fontFamily: 'Arial', color: '#c8e8a0'
    }).setOrigin(0.5);
    const menuZone = this.add.zone(16, 60, 60, 32).setOrigin(0).setInteractive({ useHandCursor: true });
    menuZone.on('pointerup', () => this.scene.start('MenuScene'));
  }

  _loadLevel() {
    const levelData = LEVELS[this.levelId - 1];
    if (!levelData) {
      this.scene.start('MenuScene');
      return;
    }

    levelData.animals.forEach(data => {
      const animal = new Animal(this, data, this.cellSize, this.gridOffsetX, this.gridOffsetY);
      this.animals.set(data.id, animal);

      // Mark occupancy
      animal.getOccupiedCells().forEach(({ row, col }) => {
        this.occupancyGrid[row][col] = data.id;
      });
    });
  }

  _setupInput() {
    this.input.on('pointerdown', this._onPointerDown, this);
    this.input.on('pointermove', this._onPointerMove, this);
    this.input.on('pointerup', this._onPointerUp, this);
  }

  _onPointerDown(pointer) {
    if (this.isAnimating) return;

    const col = Math.floor((pointer.x - this.gridOffsetX) / this.cellSize);
    const row = Math.floor((pointer.y - this.gridOffsetY) / this.cellSize);

    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) return;

    const animalId = this.occupancyGrid[row][col];
    if (!animalId) return;

    const animal = this.animals.get(animalId);
    if (!animal || animal.isExiting) return;

    this._saveHistorySnapshot();
    this.selectedAnimal = animal;
    this.isDragging = true;
    this.dragStartPointer = { x: pointer.x, y: pointer.y };
    this.dragStartCell = animal.orientation === 'H' ? animal.col : animal.row;
    animal.setHighlight(true);
  }

  _onPointerMove(pointer) {
    if (!this.isDragging || !this.selectedAnimal || this.selectedAnimal.isExiting) return;

    const cs = this.cellSize;
    const animal = this.selectedAnimal;
    const delta = animal.orientation === 'H'
      ? pointer.x - this.dragStartPointer.x
      : pointer.y - this.dragStartPointer.y;

    const rawOffset = Math.round(delta / cs);
    const clampedOffset = this._clampMove(animal, rawOffset);
    const newCell = this.dragStartCell + clampedOffset;

    const currentCell = animal.orientation === 'H' ? animal.col : animal.row;
    if (newCell !== currentCell) {
      this._updateOccupancyGrid(animal, newCell);
      animal.moveTo(newCell);
      this._checkForExit(animal);
    }
  }

  _onPointerUp(pointer) {
    if (!this.selectedAnimal) return;

    const animal = this.selectedAnimal;
    const currentCell = animal.orientation === 'H' ? animal.col : animal.row;

    if (currentCell !== this.dragStartCell && !animal.isExiting) {
      this.moveCount++;
      this._updateMoveCounter();
    } else if (currentCell === this.dragStartCell) {
      // No actual movement — discard the snapshot
      this.history.pop();
    }

    if (!animal.isExiting) {
      animal.setHighlight(false);
    }

    this.selectedAnimal = null;
    this.isDragging = false;
    this.dragStartPointer = null;
    this.dragStartCell = null;

    this._checkWin();
  }

  _clampMove(animal, requestedOffset) {
    if (requestedOffset === 0) return 0;
    const dir = requestedOffset > 0 ? 1 : -1;
    const steps = Math.abs(requestedOffset);
    let validSteps = 0;

    for (let s = 1; s <= steps; s++) {
      const testCell = this.dragStartCell + dir * s;
      if (!this._canMoveToCell(animal, testCell)) break;
      validSteps = s;
    }

    return dir * validSteps;
  }

  _canMoveToCell(animal, newCell) {
    const gs = this.gridSize;
    // Allow going beyond boundary (enables exit)
    if (animal.orientation === 'H') {
      // Check cells that would be newly occupied
      const newCol = newCell;
      for (let i = 0; i < animal.size; i++) {
        const c = newCol + i;
        if (c < 0 || c >= gs) continue; // beyond grid is OK (exit)
        const r = animal.row;
        const occupant = this.occupancyGrid[r][c];
        if (occupant && occupant !== animal.id) return false;
      }
      // Check if completely out of bounds in one direction
      if (newCol >= gs || newCol + animal.size <= 0) return true;
    } else {
      const newRow = newCell;
      for (let i = 0; i < animal.size; i++) {
        const r = newRow + i;
        if (r < 0 || r >= gs) continue;
        const c = animal.col;
        const occupant = this.occupancyGrid[r][c];
        if (occupant && occupant !== animal.id) return false;
      }
      if (newRow >= gs || newRow + animal.size <= 0) return true;
    }
    return true;
  }

  _updateOccupancyGrid(animal, newPrimaryCell) {
    // Clear old
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
        this.occupancyGrid[row][col] = null;
      }
    });

    // Update position
    if (animal.orientation === 'H') {
      animal.col = newPrimaryCell;
    } else {
      animal.row = newPrimaryCell;
    }

    // Set new
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
        this.occupancyGrid[row][col] = animal.id;
      }
    });
  }

  _checkForExit(animal) {
    if (animal.isExiting) return;
    const gs = this.gridSize;
    let direction = null;

    if (animal.orientation === 'H') {
      if (animal.col >= gs) direction = 'right';
      else if (animal.col + animal.size <= 0) direction = 'left';
    } else {
      if (animal.row >= gs) direction = 'down';
      else if (animal.row + animal.size <= 0) direction = 'up';
    }

    if (direction) {
      animal.isExiting = true;

      // Clear from occupancy
      animal.getOccupiedCells().forEach(({ row, col }) => {
        if (row >= 0 && row < gs && col >= 0 && col < gs) {
          this.occupancyGrid[row][col] = null;
        }
      });

      this.animals.delete(animal.id);
      if (this.selectedAnimal === animal) {
        this.selectedAnimal = null;
        this.isDragging = false;
      }

      this.moveCount++;
      this._updateMoveCounter();

      this.isAnimating = true;
      animal.exitAnimation(direction);

      // Brief flash effect
      const flash = this.add.graphics();
      flash.fillStyle(0xffffff, 0.4);
      flash.fillRect(0, 0, this.scale.width, this.scale.height);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 150,
        onComplete: () => flash.destroy()
      });

      this.time.delayedCall(240, () => {
        this.isAnimating = false;
        this._checkWin();
      });
    }
  }

  _checkWin() {
    if (this.animals.size === 0 && !this.isAnimating) {
      this.time.delayedCall(300, () => this._showWinScreen());
    }
  }

  _showWinScreen() {
    this._saveProgress();

    const W = this.scale.width;
    const H = this.scale.height;

    // Overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, W, H);
    this.tweens.add({ targets: overlay, fillAlpha: 0.65, duration: 300 });

    // Panel
    const panelW = 300;
    const panelH = 260;
    const px = (W - panelW) / 2;
    const py = (H - panelH) / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2a6a22, 1);
    panel.fillRoundedRect(px, py, panelW, panelH, 20);
    panel.lineStyle(3, 0x88dd44, 1);
    panel.strokeRoundedRect(px, py, panelW, panelH, 20);

    this.add.text(W / 2, py + 40, '🎉 Level Clear!', {
      fontSize: '28px', fontFamily: 'Arial', color: '#ffffff',
      fontStyle: 'bold', stroke: '#1a4a18', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(W / 2, py + 85, `Moves: ${this.moveCount}`, {
      fontSize: '20px', fontFamily: 'Arial', color: '#ccff88'
    }).setOrigin(0.5);

    this.add.text(W / 2, py + 115, '全員脱出成功！', {
      fontSize: '15px', fontFamily: 'Arial', color: '#a0e080'
    }).setOrigin(0.5);

    const hasNext = this.levelId < LEVELS.length;

    if (hasNext) {
      this._makeButton(W / 2, py + 168, 'Next Level →', 0x44aa22, 0x66cc44, () => {
        this.scene.start('GameScene', { levelId: this.levelId + 1 });
      });
    }

    this._makeButton(W / 2, py + 218, '≡ Menu', 0x2a5a18, 0x4a7a38, () => {
      this.scene.start('MenuScene');
    });
  }

  _makeButton(cx, cy, label, fillColor, hoverColor, callback) {
    const bw = 180;
    const bh = 40;
    const bx = cx - bw / 2;
    const by = cy - bh / 2;

    const bg = this.add.graphics();
    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(bx, by, bw, bh, 10);
    bg.lineStyle(2, 0x88dd44, 0.8);
    bg.strokeRoundedRect(bx, by, bw, bh, 10);

    this.add.text(cx, cy, label, {
      fontSize: '16px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const zone = this.add.zone(bx, by, bw, bh).setOrigin(0).setInteractive({ useHandCursor: true });
    zone.on('pointerup', callback);
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(hoverColor, 1);
      bg.fillRoundedRect(bx, by, bw, bh, 10);
      bg.lineStyle(2, 0xffffff, 0.6);
      bg.strokeRoundedRect(bx, by, bw, bh, 10);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(fillColor, 1);
      bg.fillRoundedRect(bx, by, bw, bh, 10);
      bg.lineStyle(2, 0x88dd44, 0.8);
      bg.strokeRoundedRect(bx, by, bw, bh, 10);
    });
  }

  _saveHistorySnapshot() {
    const snapshot = {};
    this.animals.forEach((animal, id) => {
      snapshot[id] = { row: animal.row, col: animal.col };
    });
    this.history.push(snapshot);
  }

  _undo() {
    if (this.isAnimating || this.history.length === 0) return;

    const snapshot = this.history.pop();

    // Rebuild occupancy
    this._initOccupancyGrid();

    this.animals.forEach((animal, id) => {
      const state = snapshot[id];
      if (!state) return;
      animal.row = state.row;
      animal.col = state.col;
      animal.moveTo(animal.orientation === 'H' ? animal.col : animal.row);
      animal.getOccupiedCells().forEach(({ row, col }) => {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
          this.occupancyGrid[row][col] = id;
        }
      });
    });

    if (this.moveCount > 0) this.moveCount--;
    this._updateMoveCounter();
  }

  _updateMoveCounter() {
    this.moveText.setText(`Moves: ${this.moveCount}`);
  }

  _saveProgress() {
    try {
      const raw = localStorage.getItem('animalEscapeProgress') || '[]';
      const completed = new Set(JSON.parse(raw));
      completed.add(this.levelId);
      localStorage.setItem('animalEscapeProgress', JSON.stringify([...completed]));
    } catch (e) {}
  }
}

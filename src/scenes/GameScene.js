var PIXEL_FONT = '"Press Start 2P", monospace';

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelId     = data.levelId || 1;
    this.cellSize    = 60;
    this.gridSize    = 6;
    this.animals     = new Map();
    this.oGrid       = [];
    this.moveCount   = 0;
    this.undosLeft   = 3;
    this.history     = [];
    this.selected    = null;
    this.swipeStart  = null;
    this.isAnimating = false;
  }

  preload() {}

  create() {
    const levelData = LEVELS[this.levelId - 1];
    if (!levelData) { this.scene.start('MenuScene'); return; }

    const W = this.scale.width;
    const H = this.scale.height;

    this.gridSize    = levelData.gridSize || 6;
    this.cellSize    = Math.floor((W - 40) / this.gridSize);
    this.gridOffsetX = Math.floor((W - this.gridSize * this.cellSize) / 2);
    this.gridOffsetY = 120;

    this._initOGrid();
    this._drawBackground(W, H);
    this._drawGrid();
    this._createUI(W);
    this._loadLevel();
    this._drawScanlines(W, H);
    this._setupInput();
  }

  _initOGrid() {
    this.oGrid = Array.from({ length: this.gridSize }, () => new Array(this.gridSize).fill(null));
  }

  _drawBackground(W, H) {
    const bg = this.add.graphics();
    // Dark retro background
    bg.fillStyle(0x0a0a1a, 1);
    bg.fillRect(0, 0, W, H);
    // Subtle dot grid pattern
    bg.fillStyle(0x1a1a2e, 1);
    for (let y = 0; y < H; y += 16) {
      for (let x = 0; x < W; x += 16) {
        bg.fillRect(x, y, 2, 2);
      }
    }
  }

  _drawGrid() {
    const cs = this.cellSize;
    const ox = this.gridOffsetX;
    const oy = this.gridOffsetY;
    const gs = this.gridSize;
    const g  = this.add.graphics();

    // Outer border (thick pixel border)
    g.fillStyle(0x00ff88, 1);
    g.fillRect(ox - 3, oy - 3, gs * cs + 6, 3);
    g.fillRect(ox - 3, oy + gs * cs, gs * cs + 6, 3);
    g.fillRect(ox - 3, oy - 3, 3, gs * cs + 6);
    g.fillRect(ox + gs * cs, oy - 3, 3, gs * cs + 6);

    // Cell backgrounds
    for (let r = 0; r < gs; r++) {
      for (let c = 0; c < gs; c++) {
        const even = (r + c) % 2 === 0;
        g.fillStyle(even ? 0x0d2b0d : 0x0a220a, 1);
        g.fillRect(ox + c * cs, oy + r * cs, cs, cs);
        // Pixel highlight top-left
        g.fillStyle(0x1a5a1a, 0.5);
        g.fillRect(ox + c * cs, oy + r * cs, cs, 2);
        g.fillRect(ox + c * cs, oy + r * cs, 2, cs);
      }
    }

    // Grid lines (dim)
    g.lineStyle(1, 0x1a4a1a, 1);
    for (let i = 1; i < gs; i++) {
      g.lineBetween(ox + i * cs, oy, ox + i * cs, oy + gs * cs);
      g.lineBetween(ox, oy + i * cs, ox + gs * cs, oy + i * cs);
    }

    // Exit gaps
    const gapCells = 2;
    const midCell  = Math.floor((gs - gapCells) / 2);
    const mid = midCell * cs;
    const gap = gapCells * cs;
    const by  = oy + gs * cs;
    const rx  = ox + gs * cs;

    // Draw exit gap (erase border, paint gap color)
    g.fillStyle(0x0a0a1a, 1);
    g.fillRect(ox + mid, oy - 4, gap, 5);
    g.fillRect(ox + mid, by - 1, gap, 5);
    g.fillRect(ox - 4, oy + mid, 5, gap);
    g.fillRect(rx - 1, oy + mid, 5, gap);

    // Exit arrows (pixel style ▲▼◀▶)
    const cx = ox + mid + cs;
    const cy = oy + mid + cs;
    const as = 7;
    g.fillStyle(0xffff00, 1);
    g.fillTriangle(cx - as, oy - 7,  cx + as, oy - 7,  cx, oy - 18);
    g.fillTriangle(cx - as, by + 7,  cx + as, by + 7,  cx, by + 18);
    g.fillTriangle(ox - 7, cy - as,  ox - 7, cy + as,  ox - 18, cy);
    g.fillTriangle(rx + 7, cy - as,  rx + 7, cy + as,  rx + 18, cy);

    // Floor shadow
    g.fillStyle(0x000000, 0.4);
    g.fillRect(ox + 4, oy + gs * cs + 3, gs * cs, 8);
  }

  _drawScanlines(W, H) {
    const sl = this.add.graphics();
    sl.fillStyle(0x000000, 0.06);
    for (let y = 0; y < H; y += 4) {
      sl.fillRect(0, y, W, 2);
    }
    sl.setDepth(100);
  }

  _createUI(W) {
    const levelData = LEVELS[this.levelId - 1];

    // Header bg
    const hdr = this.add.graphics();
    hdr.fillStyle(0x000000, 1);
    hdr.fillRect(0, 0, W, 112);
    hdr.lineStyle(2, 0x00ff88, 1);
    hdr.strokeRect(0, 0, W, 112);

    // Level number (pixel font)
    this.add.text(12, 10, 'LV.' + this.levelId, {
      fontSize: '14px', fontFamily: PIXEL_FONT, color: '#00ff88'
    });
    this.add.text(12, 32, levelData.theme, {
      fontSize: '7px', fontFamily: PIXEL_FONT, color: '#44ffaa'
    });

    const gs = this.gridSize;
    this.add.text(12, 48, gs + 'x' + gs, {
      fontSize: '7px', fontFamily: PIXEL_FONT, color: '#ffff00'
    });
    this.add.text(12, 64, 'PAR:' + levelData.par, {
      fontSize: '7px', fontFamily: PIXEL_FONT, color: '#aaaaaa'
    });

    // Move counter (centre)
    this.moveText = this.add.text(W / 2, 12, 'MOVE:0', {
      fontSize: '10px', fontFamily: PIXEL_FONT, color: '#ffffff'
    }).setOrigin(0.5, 0);

    // Undo icons (pixel style)
    this._undoIcons = [];
    for (let i = 0; i < 3; i++) {
      const icon = this.add.text(W - 16 - i * 26, 12, 'U', {
        fontSize: '10px', fontFamily: PIXEL_FONT, color: '#00ff88'
      }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      icon.on('pointerup', () => this._undo());
      this._undoIcons.push(icon);
    }
    this._refreshUndoUI();

    // Menu button
    this._pixelBtn(14, 78, 56, 22, '≡MENU', () => this.scene.start('MenuScene'));

    // Retry button
    this._pixelBtn(W - 72, 78, 58, 22, '↺RETRY', () => this.scene.start('GameScene', { levelId: this.levelId }));
  }

  _pixelBtn(x, y, w, h, label, cb) {
    const bg = this.add.graphics();
    const draw = (lit) => {
      bg.clear();
      bg.fillStyle(lit ? 0x005522 : 0x001a0d, 1);
      bg.fillRect(x, y, w, h);
      bg.lineStyle(2, lit ? 0x00ff88 : 0x007744, 1);
      bg.strokeRect(x, y, w, h);
    };
    draw(false);
    this.add.text(x + w / 2, y + h / 2, label, {
      fontSize: '6px', fontFamily: PIXEL_FONT, color: '#00ff88'
    }).setOrigin(0.5, 0.5);
    this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerover', () => draw(true))
      .on('pointerout',  () => draw(false))
      .on('pointerup', cb);
  }

  _refreshUndoUI() {
    this._undoIcons.forEach((icon, i) => {
      const active = (2 - i) < this.undosLeft;
      icon.setAlpha(active ? 1 : 0.25);
      icon.setColor(active ? '#00ff88' : '#224422');
    });
  }

  _loadLevel() {
    const levelData = LEVELS[this.levelId - 1];
    if (!levelData) { this.scene.start('MenuScene'); return; }

    levelData.animals.forEach(data => {
      const a = new Animal(this, data, this.cellSize, this.gridOffsetX, this.gridOffsetY);
      this.animals.set(data.id, a);
      a.getOccupiedCells().forEach(({ row, col }) => {
        this.oGrid[row][col] = data.id;
      });
    });
  }

  _setupInput() {
    this.input.on('pointerdown', this._onPointerDown, this);
    this.input.on('pointermove', this._onPointerMove, this);
    this.input.on('pointerup',   this._onPointerUp,   this);
  }

  _onPointerDown(pointer) {
    if (this.isAnimating) return;
    this.swipeStart = { x: pointer.x, y: pointer.y };

    const col = Math.floor((pointer.x - this.gridOffsetX) / this.cellSize);
    const row = Math.floor((pointer.y - this.gridOffsetY) / this.cellSize);

    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
      this._deselect(); return;
    }
    const id = this.oGrid[row][col];
    if (!id) { this._deselect(); return; }
    const animal = this.animals.get(id);
    if (!animal || animal.isExiting) { this._deselect(); return; }
    if (this.selected === animal) return;

    this._deselect();
    this.selected = animal;
    animal.setHighlight(true);
    this._showArrows(animal);
  }

  _onPointerMove(pointer) {
    if (!this.selected || this.isAnimating || !this.swipeStart) return;
    const dx = pointer.x - this.swipeStart.x;
    const dy = pointer.y - this.swipeStart.y;
    const THRESHOLD = 22;
    if (this.selected.orientation === 'H') {
      if (Math.abs(dx) > THRESHOLD) this._doAutoSlide(dx > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(dy) > THRESHOLD) this._doAutoSlide(dy > 0 ? 'down' : 'up');
    }
  }

  _onPointerUp() { this.swipeStart = null; }

  _deselect() {
    if (!this.selected) return;
    this.selected.setHighlight(false);
    this.selected.hideArrows();
    this.selected = null;
  }

  _showArrows(animal) {
    const canLeft  = animal.orientation === 'H' && this._maxSlide(animal, -1) > 0;
    const canRight = animal.orientation === 'H' && this._maxSlide(animal,  1) > 0;
    const canUp    = animal.orientation === 'V' && this._maxSlide(animal, -1) > 0;
    const canDown  = animal.orientation === 'V' && this._maxSlide(animal,  1) > 0;
    animal.showArrows(canLeft, canRight, canUp, canDown, (dir) => this._doAutoSlide(dir));
  }

  _doAutoSlide(direction) {
    const animal = this.selected;
    if (!animal || animal.isExiting || this.isAnimating) return;

    const isHDir = direction === 'left' || direction === 'right';
    const isVDir = direction === 'up'   || direction === 'down';
    if ((animal.orientation === 'H' && !isHDir) ||
        (animal.orientation === 'V' && !isVDir)) return;

    const dir1D = (direction === 'right' || direction === 'down') ? 1 : -1;
    const steps = this._maxSlide(animal, dir1D);
    if (steps === 0) return;

    this._saveSnapshot();
    this._deselect();

    const startCell = animal.orientation === 'H' ? animal.col : animal.row;
    const newCell   = startCell + dir1D * steps;

    this._updateOGrid(animal, newCell);
    animal.moveTo(newCell);

    this.moveCount++;
    this._updateMoveCounter();
    this.swipeStart = null;

    this.isAnimating = true;
    this.time.delayedCall(100, () => {
      this.isAnimating = false;
      this._checkForExit(animal, direction);
      this._checkWin();
    });
  }

  _maxSlide(animal, dir) {
    const gs    = this.gridSize;
    const start = animal.orientation === 'H' ? animal.col : animal.row;
    let valid   = 0;

    for (let s = 1; s <= gs * 2; s++) {
      const test = start + dir * s;
      let blocked = false;
      for (let i = 0; i < animal.size; i++) {
        const r = animal.orientation === 'V' ? test + i : animal.row;
        const c = animal.orientation === 'H' ? test + i : animal.col;
        if (r < 0 || r >= gs || c < 0 || c >= gs) continue;
        const occ = this.oGrid[r][c];
        if (occ && occ !== animal.id) { blocked = true; break; }
      }
      if (blocked) break;
      valid = s;
      const exits = dir > 0 ? test >= gs : test + animal.size <= 0;
      if (exits) break;
    }
    return valid;
  }

  _updateOGrid(animal, newPrimary) {
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize)
        this.oGrid[row][col] = null;
    });
    if (animal.orientation === 'H') animal.col = newPrimary;
    else                             animal.row = newPrimary;
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize)
        this.oGrid[row][col] = animal.id;
    });
  }

  _checkForExit(animal, direction) {
    if (animal.isExiting) return;
    const gs = this.gridSize;
    let exitDir = null;

    if (animal.orientation === 'H') {
      if (animal.col >= gs)                   exitDir = 'right';
      else if (animal.col + animal.size <= 0) exitDir = 'left';
    } else {
      if (animal.row >= gs)                   exitDir = 'down';
      else if (animal.row + animal.size <= 0) exitDir = 'up';
    }
    if (!exitDir) return;

    animal.isExiting = true;
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < gs && col >= 0 && col < gs)
        this.oGrid[row][col] = null;
    });
    this.animals.delete(animal.id);
    if (this.selected === animal) this.selected = null;

    animal.exitAnimation(exitDir);
    this._spawnExitParticles(animal.container.x, animal.container.y);
  }

  _spawnExitParticles(x, y) {
    const colors = [0x00ff88, 0xffff00, 0x00ffff, 0xff88ff];
    for (let i = 0; i < 8; i++) {
      const star = this.add.graphics();
      star.fillStyle(colors[i % colors.length], 1);
      // Pixel star (just a rect for 8bit style)
      star.fillRect(-3, -3, 6, 6);
      star.setPosition(x + Phaser.Math.Between(-24, 24), y + Phaser.Math.Between(-12, 12));
      this.tweens.add({
        targets: star,
        x: star.x + Phaser.Math.Between(-50, 50),
        y: star.y + Phaser.Math.Between(-60, 10),
        alpha: 0,
        scaleX: 0.1, scaleY: 0.1,
        duration: 350 + i * 30,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  _checkWin() {
    if (this.animals.size === 0 && !this.isAnimating) {
      this.time.delayedCall(350, () => this._showWinScreen());
    }
  }

  _showWinScreen() {
    const par   = LEVELS[this.levelId - 1].par;
    const stars = this.moveCount <= par ? 3
                : this.moveCount <= Math.floor(par * 1.5) ? 2 : 1;
    this._saveProgress(stars);

    const W  = this.scale.width;
    const H  = this.scale.height;
    const pw = 320, ph = 280;
    const px = (W - pw) / 2;
    const py = (H - ph) / 2;

    // Overlay
    const ov = this.add.graphics();
    ov.fillStyle(0x000000, 0.75);
    ov.fillRect(0, 0, W, H);

    // Panel (pixel border style)
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 1);
    panel.fillRect(px, py, pw, ph);
    panel.lineStyle(3, 0x00ff88, 1);
    panel.strokeRect(px, py, pw, ph);
    panel.lineStyle(1, 0x004422, 1);
    panel.strokeRect(px + 4, py + 4, pw - 8, ph - 8);

    this.add.text(W / 2, py + 24, 'LEVEL CLEAR!', {
      fontSize: '13px', fontFamily: PIXEL_FONT, color: '#00ff88'
    }).setOrigin(0.5);

    const starStr = '★'.repeat(Math.max(0, stars)) + '☆'.repeat(Math.max(0, 3 - stars));
    const starTxt = this.add.text(W / 2, py + 60, starStr, {
      fontSize: '24px', fontFamily: PIXEL_FONT,
      color: stars === 3 ? '#ffff00' : '#aaaaaa'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(150, () => {
      this.tweens.add({ targets: starTxt, alpha: 1, scaleX: 1.2, scaleY: 1.2,
        duration: 200, yoyo: true });
    });

    this.add.text(W / 2, py + 100, this.moveCount + ' MOVES', {
      fontSize: '9px', fontFamily: PIXEL_FONT, color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(W / 2, py + 118, 'PAR: ' + par, {
      fontSize: '8px', fontFamily: PIXEL_FONT, color: '#888888'
    }).setOrigin(0.5);

    const label = stars === 3 ? 'PERFECT!!' : stars === 2 ? 'GREAT!' : 'CLEARED!';
    this.add.text(W / 2, py + 140, label, {
      fontSize: '10px', fontFamily: PIXEL_FONT,
      color: stars === 3 ? '#ffff00' : '#00ff88'
    }).setOrigin(0.5);

    const hasNext = this.levelId < LEVELS.length;
    let btnY = py + 170;

    if (stars < 3) {
      this._winBtn(W / 2, btnY, 'RETRY', () => this.scene.start('GameScene', { levelId: this.levelId }));
      btnY += 36;
    }
    if (hasNext) {
      this._winBtn(W / 2, btnY, 'NEXT >', () => this.scene.start('GameScene', { levelId: this.levelId + 1 }));
      btnY += 36;
    }
    this._winBtn(W / 2, btnY, 'MENU', () => this.scene.start('MenuScene'));
  }

  _winBtn(cx, cy, label, cb) {
    const bw = 180, bh = 30;
    const bx = cx - bw / 2, by = cy - bh / 2;
    const bg = this.add.graphics();
    const draw = (lit) => {
      bg.clear();
      bg.fillStyle(lit ? 0x005522 : 0x001a0d, 1);
      bg.fillRect(bx, by, bw, bh);
      bg.lineStyle(2, lit ? 0x00ff88 : 0x007744, 1);
      bg.strokeRect(bx, by, bw, bh);
    };
    draw(false);
    this.add.text(cx, cy, label, {
      fontSize: '9px', fontFamily: PIXEL_FONT, color: '#00ff88'
    }).setOrigin(0.5);
    this.add.zone(bx, by, bw, bh).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerup', cb)
      .on('pointerover', () => draw(true))
      .on('pointerout',  () => draw(false));
  }

  _saveSnapshot() {
    const snap = {};
    this.animals.forEach((a, id) => { snap[id] = { row: a.row, col: a.col }; });
    this.history.push(snap);
  }

  _undo() {
    if (this.isAnimating || this.history.length === 0 || this.undosLeft === 0) return;
    const snap = this.history.pop();
    this._deselect();
    this._initOGrid();

    this.animals.forEach((a, id) => {
      const s = snap[id];
      if (!s) return;
      a.row = s.row;
      a.col = s.col;
      a.moveTo(a.orientation === 'H' ? a.col : a.row);
      a.getOccupiedCells().forEach(({ row, col }) => {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize)
          this.oGrid[row][col] = id;
      });
    });

    if (this.moveCount > 0) this.moveCount--;
    this.undosLeft--;
    this._updateMoveCounter();
    this._refreshUndoUI();
  }

  _updateMoveCounter() {
    this.moveText.setText('MOVE:' + this.moveCount);
  }

  _saveProgress(stars) {
    try {
      const raw  = localStorage.getItem('animalEscapeProgress') || '{}';
      const prog = JSON.parse(raw);
      prog[this.levelId] = Math.max(prog[this.levelId] || 0, stars);
      localStorage.setItem('animalEscapeProgress', JSON.stringify(prog));
    } catch (e) {}
  }
}

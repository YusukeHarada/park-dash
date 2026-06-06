class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelId   = data.levelId || 1;
    this.cellSize  = 60;
    this.gridSize  = 6;
    this.animals   = new Map();
    this.oGrid     = [];
    this.moveCount = 0;
    this.undosLeft = 3;
    this.history   = [];
    this.selected  = null;
    this.swipeStart = null;
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
    this.gridOffsetY = 115;

    this._initOGrid();
    this._drawBackground(W, H);
    this._drawGrid();
    this._createUI(W);
    this._loadLevel();
    this._setupInput();
  }

  // ── Grid / Scene init ────────────────────────────────────────────

  _initOGrid() {
    this.oGrid = Array.from({ length: this.gridSize }, () => new Array(this.gridSize).fill(null));
  }

  _drawBackground(W, H) {
    const bg = this.add.graphics();
    // Gradient-like background (dark at top, lighter mid)
    bg.fillStyle(0x2a5a22, 1);
    bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x3a7a30, 1);
    bg.fillRect(0, H * 0.2, W, H * 0.8);
    // Decorative grass tufts
    bg.fillStyle(0x4a8a40, 0.25);
    for (let i = 0; i < 16; i++) {
      bg.fillEllipse((i * 67 + 23) % W, (i * 83 + 41) % H,
        60 + (i * 13) % 40, 20 + (i * 7) % 15);
    }
    // Floor shadow under grid
    const gs = this.gridSize, cs = this.cellSize;
    const ox = this.gridOffsetX, oy = this.gridOffsetY;
    bg.fillStyle(0x000000, 0.18);
    bg.fillRoundedRect(ox + 6, oy + gs * cs + 4, gs * cs, 14, 4);
  }

  _drawGrid() {
    const cs = this.cellSize;
    const ox = this.gridOffsetX;
    const oy = this.gridOffsetY;
    const gs = this.gridSize;
    const g  = this.add.graphics();

    // Cell backgrounds with subtle 3D tile effect
    for (let r = 0; r < gs; r++) {
      for (let c = 0; c < gs; c++) {
        const even = (r + c) % 2 === 0;
        const base = even ? 0x68a856 : 0x589048;
        const dark = even ? 0x4a7a3a : 0x3a6a2a;
        const lite = even ? 0x7abb68 : 0x6aab58;
        const cx = ox + c * cs + 1, cy = oy + r * cs + 1;
        const cw = cs - 2, ch = cs - 2;
        // Base fill
        g.fillStyle(base, 1);
        g.fillRect(cx, cy, cw, ch);
        // Top-left highlight strip
        g.fillStyle(lite, 0.35);
        g.fillRect(cx, cy, cw, 4);
        g.fillRect(cx, cy, 4, ch);
        // Bottom-right shadow strip
        g.fillStyle(dark, 0.4);
        g.fillRect(cx, cy + ch - 4, cw, 4);
        g.fillRect(cx + cw - 4, cy, 4, ch);
      }
    }

    // Inner grid lines
    g.lineStyle(1, 0x3a5a28, 1);
    for (let i = 1; i < gs; i++) {
      g.lineBetween(ox + i * cs, oy, ox + i * cs, oy + gs * cs);
      g.lineBetween(ox, oy + i * cs, ox + gs * cs, oy + i * cs);
    }

    // Outer fence with exit gaps at centre of each side
    g.lineStyle(4, 0x2a4a18, 1);
    const gapCells = 2;
    const midCell  = Math.floor((gs - gapCells) / 2);
    const mid = midCell * cs;
    const gap = gapCells * cs;

    // Top
    g.lineBetween(ox,           oy, ox + mid,        oy);
    g.lineBetween(ox + mid + gap, oy, ox + gs * cs,  oy);
    // Bottom
    const by = oy + gs * cs;
    g.lineBetween(ox,           by, ox + mid,        by);
    g.lineBetween(ox + mid + gap, by, ox + gs * cs,  by);
    // Left
    g.lineBetween(ox, oy,           ox, oy + mid);
    g.lineBetween(ox, oy + mid + gap, ox, oy + gs * cs);
    // Right
    const rx = ox + gs * cs;
    g.lineBetween(rx, oy,           rx, oy + mid);
    g.lineBetween(rx, oy + mid + gap, rx, oy + gs * cs);

    // Exit arrows
    g.fillStyle(0xffffff, 0.7);
    const cx = ox + mid + cs;
    const cy = oy + mid + cs;
    const as = 10;
    g.fillTriangle(cx - as, oy - 6, cx + as, oy - 6, cx, oy - 20);
    g.fillTriangle(cx - as, by + 6, cx + as, by + 6, cx, by + 20);
    g.fillTriangle(ox - 6, cy - as, ox - 6, cy + as, ox - 20, cy);
    g.fillTriangle(rx + 6, cy - as, rx + 6, cy + as, rx + 20, cy);
  }

  _createUI(W) {
    const levelData = LEVELS[this.levelId - 1];

    // Header bg
    const hdr = this.add.graphics();
    hdr.fillStyle(0x1a4a18, 0.88);
    hdr.fillRect(0, 0, W, 108);

    // Level title
    this.add.text(14, 12, `Level ${this.levelId}`, {
      fontSize: '22px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff', stroke: '#1a4a18', strokeThickness: 4
    });
    this.add.text(14, 38, levelData.theme, {
      fontSize: '13px', fontFamily: 'Arial', color: '#aaddaa'
    });

    // Grid size badge
    const gs = this.gridSize;
    this.add.text(14, 56, gs + '×' + gs, {
      fontSize: '11px', fontFamily: 'Arial', color: '#88cc66'
    });

    // Par display
    this.add.text(14, 70, `par: ${levelData.par}`, {
      fontSize: '12px', fontFamily: 'Arial', color: '#88cc66', alpha: 0.9
    });

    // Move counter (centre)
    this.moveText = this.add.text(W / 2, 20, 'Moves: 0', {
      fontSize: '20px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff', stroke: '#1a4a18', strokeThickness: 3
    }).setOrigin(0.5, 0);

    // Undo icons (right side)
    this._undoIcons = [];
    for (let i = 0; i < 3; i++) {
      const icon = this.add.text(W - 22 - i * 28, 16, '↩', {
        fontSize: '22px', fontFamily: 'Arial', color: '#88dd44'
      }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      icon.on('pointerup', () => this._undo());
      this._undoIcons.push(icon);
    }
    this._refreshUndoUI();

    // Menu button
    const menuBg = this.add.graphics();
    menuBg.fillStyle(0x2a5a18, 1);
    menuBg.fillRoundedRect(14, 75, 60, 26, 6);
    this.add.text(44, 88, '≡ Menu', {
      fontSize: '12px', fontFamily: 'Arial', color: '#c8e8a0'
    }).setOrigin(0.5);
    this.add.zone(14, 75, 60, 26).setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('MenuScene'));

    // Retry button
    const retBg = this.add.graphics();
    retBg.fillStyle(0x2a5a18, 1);
    retBg.fillRoundedRect(W - 80, 70, 66, 26, 6);
    this.add.text(W - 47, 83, '↺ Retry', {
      fontSize: '12px', fontFamily: 'Arial', color: '#c8e8a0'
    }).setOrigin(0.5);
    this.add.zone(W - 80, 70, 66, 26).setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.scene.start('GameScene', { levelId: this.levelId }));
  }

  _refreshUndoUI() {
    this._undoIcons.forEach((icon, i) => {
      const active = (2 - i) < this.undosLeft;
      icon.setAlpha(active ? 1 : 0.28);
      icon.setColor(active ? '#88dd44' : '#446633');
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

  // ── Input ────────────────────────────────────────────────────────

  _onPointerDown(pointer) {
    if (this.isAnimating) return;
    this.swipeStart = { x: pointer.x, y: pointer.y };

    const col = Math.floor((pointer.x - this.gridOffsetX) / this.cellSize);
    const row = Math.floor((pointer.y - this.gridOffsetY) / this.cellSize);

    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
      this._deselect();
      return;
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
      if (Math.abs(dx) > THRESHOLD) {
        this._doAutoSlide(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > THRESHOLD) {
        this._doAutoSlide(dy > 0 ? 'down' : 'up');
      }
    }
  }

  _onPointerUp() {
    this.swipeStart = null;
  }

  // ── Selection / Arrows ──────────────────────────────────────────

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

    animal.showArrows(canLeft, canRight, canUp, canDown, (dir) => {
      this._doAutoSlide(dir);
    });
  }

  // ── Auto-slide ───────────────────────────────────────────────────

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
    this.time.delayedCall(110, () => {
      this.isAnimating = false;
      this._checkForExit(animal, direction);
      this._checkWin();
    });
  }

  // ── Collision / move calculation ─────────────────────────────────

  _maxSlide(animal, dir) {
    const gs = this.gridSize;
    const start = animal.orientation === 'H' ? animal.col : animal.row;
    let valid = 0;

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

      const exits = animal.orientation === 'H'
        ? (dir > 0 ? test >= gs : test + animal.size <= 0)
        : (dir > 0 ? test >= gs : test + animal.size <= 0);
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

  // ── Exit / Win ───────────────────────────────────────────────────

  _checkForExit(animal, direction) {
    if (animal.isExiting) return;
    const gs = this.gridSize;
    let exitDir = null;

    if (animal.orientation === 'H') {
      if (animal.col >= gs)              exitDir = 'right';
      else if (animal.col + animal.size <= 0) exitDir = 'left';
    } else {
      if (animal.row >= gs)              exitDir = 'down';
      else if (animal.row + animal.size <= 0) exitDir = 'up';
    }

    if (!exitDir) return;

    animal.isExiting = true;
    animal.getOccupiedCells().forEach(({ row, col }) => {
      if (row >= 0 && row < gs && col >= 0 && col < gs)
        this.oGrid[row][col] = null;
    });
    this.animals.delete(animal.id);

    if (this.selected === animal) { this.selected = null; }

    animal.exitAnimation(exitDir);
    this._spawnExitParticles(animal.container.x, animal.container.y);
  }

  _spawnExitParticles(x, y) {
    const colors = [0xffdd44, 0x88ff44, 0x44ddff, 0xff88cc];
    for (let i = 0; i < 6; i++) {
      const star = this.add.graphics();
      star.fillStyle(colors[i % colors.length], 1);
      star.fillCircle(0, 0, 5);
      star.setPosition(x + Phaser.Math.Between(-20, 20), y + Phaser.Math.Between(-10, 10));
      this.tweens.add({
        targets: star,
        x: star.x + Phaser.Math.Between(-40, 40),
        y: star.y + Phaser.Math.Between(-50, 10),
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 400 + i * 40,
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

  // ── Win screen ───────────────────────────────────────────────────

  _showWinScreen() {
    const par    = LEVELS[this.levelId - 1].par;
    const stars  = this.moveCount <= par ? 3
                 : this.moveCount <= Math.floor(par * 1.5) ? 2 : 1;

    this._saveProgress(stars);

    const W  = this.scale.width;
    const H  = this.scale.height;
    const pw = 300, ph = 310;
    const px = (W - pw) / 2;
    const py = (H - ph) / 2;

    const ov = this.add.graphics();
    ov.fillStyle(0x000000, 0);
    ov.fillRect(0, 0, W, H);
    this.tweens.add({ targets: ov, fillAlpha: 0.65, duration: 300 });

    const panel = this.add.graphics();
    panel.fillStyle(0x1e5a18, 1);
    panel.fillRoundedRect(px, py, pw, ph, 20);
    panel.lineStyle(3, 0x66cc33, 1);
    panel.strokeRoundedRect(px, py, pw, ph, 20);

    this.add.text(W / 2, py + 32, '🎉 Level Clear!', {
      fontSize: '26px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff', stroke: '#1a4a18', strokeThickness: 4
    }).setOrigin(0.5);

    const starStr = '⭐'.repeat(Math.max(0, stars)) + '☆'.repeat(Math.max(0, 3 - stars));
    const starTxt = this.add.text(W / 2, py + 75, '   ', {
      fontSize: '32px'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(200, () => {
      starTxt.setText(starStr);
      this.tweens.add({ targets: starTxt, alpha: 1, scaleX: 1.2, scaleY: 1.2,
        duration: 300, yoyo: true, ease: 'Bounce.easeOut' });
    });

    this.add.text(W / 2, py + 115, `${this.moveCount} moves  (par: ${par})`, {
      fontSize: '16px', fontFamily: 'Arial',
      color: stars === 3 ? '#88ff44' : '#ccddaa'
    }).setOrigin(0.5);

    const label = stars === 3 ? 'Perfect! 🌟' : stars === 2 ? 'Great!' : 'Cleared!';
    this.add.text(W / 2, py + 145, label, {
      fontSize: '15px', fontFamily: 'Arial', color: '#aaddaa'
    }).setOrigin(0.5);

    const hasPrev = this.levelId > 1;
    const hasNext = this.levelId < LEVELS.length;

    if (stars < 3) {
      this._winBtn(W / 2, py + 195, '↺ Retry', 0x3a6a28, 0x5a8a48, () => {
        this.scene.start('GameScene', { levelId: this.levelId });
      });
    }
    if (hasNext) {
      this._winBtn(W / 2, py + (stars < 3 ? 245 : 210), 'Next Level →', 0x44aa22, 0x66cc44, () => {
        this.scene.start('GameScene', { levelId: this.levelId + 1 });
      });
    }
    this._winBtn(W / 2, py + (hasNext ? (stars < 3 ? 285 : 255) : (stars < 3 ? 245 : 210)), '≡ Menu', 0x2a5a18, 0x4a7a38, () => {
      this.scene.start('MenuScene');
    });
  }

  _winBtn(cx, cy, label, fill, hover, cb) {
    const bw = 200, bh = 38;
    const bx = cx - bw / 2, by = cy - bh / 2;
    const bg = this.add.graphics();
    const draw = (c) => {
      bg.clear();
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(bx, by, bw, bh, 10);
      bg.lineStyle(2, 0x88dd44, 0.8);
      bg.strokeRoundedRect(bx, by, bw, bh, 10);
    };
    draw(fill);
    this.add.text(cx, cy, label, {
      fontSize: '15px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.zone(bx, by, bw, bh).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerup', cb)
      .on('pointerover', () => draw(hover))
      .on('pointerout', () => draw(fill));
  }

  // ── Undo ─────────────────────────────────────────────────────────

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
    this.moveText.setText(`Moves: ${this.moveCount}`);
  }

  // ── Progress ─────────────────────────────────────────────────────

  _saveProgress(stars) {
    try {
      const raw  = localStorage.getItem('animalEscapeProgress') || '{}';
      const prog = JSON.parse(raw);
      prog[this.levelId] = Math.max(prog[this.levelId] || 0, stars);
      localStorage.setItem('animalEscapeProgress', JSON.stringify(prog));
    } catch (e) {}
  }
}

var ANIMAL_EMOJI = {
  sheep:  '🐑', chick:  '🐥', pig:    '🐷',
  rabbit: '🐰', cow:    '🐮', duck:   '🦆',
  cat:    '🐱', dog:    '🐶'
};

var ANIMAL_COLORS = {
  sheep: 0xf0ece0, chick: 0xffdd44, pig: 0xffb6c1,
  rabbit: 0xe0e0ff, cow: 0xd0f0d0, duck: 0xa8d888,
  cat: 0xffe0a0, dog: 0xd4a060
};

var ANIMAL_BORDER = {
  sheep: 0xb0a888, chick: 0xcc9900, pig: 0xcc7788,
  rabbit: 0x9898cc, cow: 0x88b888, duck: 0x669944,
  cat: 0xcc9933, dog: 0x996633
};

var ANIMAL_SIDE = {
  sheep: 0xc8c2b5, chick: 0xccaa22, pig: 0xdd8899,
  rabbit: 0xb8b8dd, cow: 0xa0c8a0, duck: 0x80b060,
  cat: 0xddbb70, dog: 0xaa7840
};

var ANIMAL_BOTTOM = {
  sheep: 0xa09a8a, chick: 0xaa8800, pig: 0xbb6677,
  rabbit: 0x9090bb, cow: 0x80a880, duck: 0x609040,
  cat: 0xbb9950, dog: 0x885a28
};

class Animal {
  constructor(scene, data, cellSize, offsetX, offsetY) {
    this.scene       = scene;
    this.id          = data.id;
    this.orientation = data.orientation;
    this.row         = data.row;
    this.col         = data.col;
    this.size        = data.size;
    this.animalType  = data.animal;
    this.cellSize    = cellSize;
    this.offsetX     = offsetX;
    this.offsetY     = offsetY;
    this.isExiting   = false;

    this._arrowObjs = [];
    this._depth     = Math.max(4, Math.floor(cellSize * 0.12));

    this.container = scene.add.container(0, 0);
    this._createVisual();
  }

  _createVisual() {
    const cs  = this.cellSize;
    const pad = 4;
    const w   = this.orientation === 'H' ? this.size * cs - pad * 2 : cs - pad * 2;
    const h   = this.orientation === 'V' ? this.size * cs - pad * 2 : cs - pad * 2;
    const d   = this._depth;

    const fill   = ANIMAL_COLORS[this.animalType];
    const border = ANIMAL_BORDER[this.animalType];
    const side   = ANIMAL_SIDE[this.animalType];
    const btm    = ANIMAL_BOTTOM[this.animalType];

    // Pixel shadow (offset block)
    const shadow = this.scene.add.graphics();
    shadow.fillStyle(0x000000, 0.5);
    shadow.fillRect(d + 2, h + d + 1, w, d);
    shadow.fillRect(w + d + 1, d + 2, d, h);

    // Bottom face (pixel style - no rounding)
    this.btmGfx = this.scene.add.graphics();
    this.btmGfx.fillStyle(btm, 1);
    this.btmGfx.fillRect(d, h, w, d + 1);
    this.btmGfx.lineStyle(2, border, 1);
    this.btmGfx.strokeRect(d, h, w, d + 1);

    // Right face (pixel style)
    this.sideGfx = this.scene.add.graphics();
    this.sideGfx.fillStyle(side, 1);
    this.sideGfx.fillRect(w, d, d + 1, h);
    this.sideGfx.lineStyle(2, border, 1);
    this.sideGfx.strokeRect(w, d, d + 1, h);

    // Top face
    this.bodyGfx = this.scene.add.graphics();
    this._drawBody(this.bodyGfx, w, h, fill, border, false);

    // Selection ring
    this.ringGfx = this.scene.add.graphics();

    // Emojis
    const emoji    = ANIMAL_EMOJI[this.animalType];
    const fontSize = Math.min(cs * 0.46, 22);
    if (this.size >= 2 && this.orientation === 'H') {
      this.emoji1 = this._makeEmoji(cs * 0.5,  h / 2, emoji, fontSize);
      this.emoji2 = this._makeEmoji(cs * 1.5,  h / 2, emoji, fontSize);
      if (this.size === 3)
        this.emoji3 = this._makeEmoji(cs * 2.5, h / 2, emoji, fontSize);
    } else if (this.size >= 2 && this.orientation === 'V') {
      this.emoji1 = this._makeEmoji(w / 2, cs * 0.5,  emoji, fontSize);
      this.emoji2 = this._makeEmoji(w / 2, cs * 1.5,  emoji, fontSize);
      if (this.size === 3)
        this.emoji3 = this._makeEmoji(w / 2, cs * 2.5, emoji, fontSize);
    } else {
      this.emoji1 = this._makeEmoji(w / 2, h / 2, emoji, fontSize * 1.2);
    }

    this.container.add([shadow, this.btmGfx, this.sideGfx, this.bodyGfx, this.ringGfx]);
    if (this.emoji3) this.container.add(this.emoji3);
    if (this.emoji2) this.container.add(this.emoji2);
    this.container.add(this.emoji1);

    const hitZone = new Phaser.Geom.Rectangle(0, 0, w, h);
    this.container.setInteractive(hitZone, Phaser.Geom.Rectangle.Contains);

    this._syncPosition();
  }

  _makeEmoji(x, y, emoji, size) {
    return this.scene.add.text(x, y, emoji, {
      fontSize: size + 'px'
    }).setOrigin(0.5, 0.5);
  }

  _drawBody(gfx, w, h, fill, border, highlighted) {
    gfx.clear();
    // Main fill
    gfx.fillStyle(fill, 1);
    gfx.fillRect(0, 0, w, h);
    // Top-left bright pixel highlight
    gfx.fillStyle(0xffffff, 0.30);
    gfx.fillRect(2, 2, w - 4, 4);
    gfx.fillRect(2, 2, 4, h - 4);
    // Bottom-right dark pixel shadow
    gfx.fillStyle(0x000000, 0.15);
    gfx.fillRect(2, h - 5, w - 4, 3);
    gfx.fillRect(w - 5, 2, 3, h - 4);
    // Pixel border (2px sharp)
    gfx.lineStyle(highlighted ? 3 : 2, highlighted ? 0x00ff88 : border, 1);
    gfx.strokeRect(0, 0, w, h);
    if (highlighted) {
      gfx.lineStyle(2, 0x00ff88, 0.5);
      gfx.strokeRect(-3, -3, w + 6, h + 6);
    }
  }

  _syncPosition() {
    const pad = 4;
    this.container.setPosition(
      this.offsetX + this.col * this.cellSize + pad,
      this.offsetY + this.row * this.cellSize + pad
    );
  }

  getOccupiedCells() {
    const cells = [];
    for (let i = 0; i < this.size; i++) {
      cells.push({
        row: this.orientation === 'V' ? this.row + i : this.row,
        col: this.orientation === 'H' ? this.col + i : this.col
      });
    }
    return cells;
  }

  moveTo(newCell) {
    this.scene.tweens.killTweensOf(this.container);
    const pad = 4;
    const cs  = this.cellSize;
    if (this.orientation === 'H') {
      this.col = newCell;
      this.scene.tweens.add({
        targets: this.container,
        x: this.offsetX + this.col * cs + pad,
        duration: 80,
        ease: 'Cubic.easeOut'
      });
    } else {
      this.row = newCell;
      this.scene.tweens.add({
        targets: this.container,
        y: this.offsetY + this.row * cs + pad,
        duration: 80,
        ease: 'Cubic.easeOut'
      });
    }
  }

  exitAnimation(direction) {
    this.isExiting = true;
    this.scene.tweens.killTweensOf(this.container);

    const cs  = this.cellSize;
    const pad = 4;
    const w   = this.orientation === 'H' ? this.size * cs : cs;
    const h   = this.orientation === 'V' ? this.size * cs : cs;
    const pos = { x: this.container.x, y: this.container.y };

    switch (direction) {
      case 'right': pos.x = this.offsetX + this.scene.gridSize * cs + w; break;
      case 'left':  pos.x = this.offsetX - w - pad * 2;                  break;
      case 'down':  pos.y = this.offsetY + this.scene.gridSize * cs + h; break;
      case 'up':    pos.y = this.offsetY - h - pad * 2;                  break;
    }

    this.scene.tweens.add({
      targets: this.container,
      x: pos.x, y: pos.y,
      scaleX: 0.4, scaleY: 0.4,
      alpha: 0,
      duration: 240,
      ease: 'Cubic.easeIn',
      onComplete: () => this.destroy()
    });
  }

  setHighlight(active) {
    const cs  = this.cellSize;
    const pad = 4;
    const w   = this.orientation === 'H' ? this.size * cs - pad * 2 : cs - pad * 2;
    const h   = this.orientation === 'V' ? this.size * cs - pad * 2 : cs - pad * 2;

    this._drawBody(this.bodyGfx, w, h,
      ANIMAL_COLORS[this.animalType],
      ANIMAL_BORDER[this.animalType],
      active);

    this.ringGfx.clear();
  }

  showArrows(canLeft, canRight, canUp, canDown, onSlide) {
    this.hideArrows();
    const cs  = this.cellSize;
    const pad = 4;
    const w   = this.orientation === 'H' ? this.size * cs - pad * 2 : cs - pad * 2;
    const h   = this.orientation === 'V' ? this.size * cs - pad * 2 : cs - pad * 2;

    const dirs = [
      { dir: 'left',  show: canLeft,  ax: -26, ay: h / 2 },
      { dir: 'right', show: canRight, ax: w + 26, ay: h / 2 },
      { dir: 'up',    show: canUp,    ax: w / 2, ay: -26 },
      { dir: 'down',  show: canDown,  ax: w / 2, ay: h + 26 }
    ];

    dirs.forEach(({ dir, show, ax, ay }) => {
      if (!show) return;

      const g = this.scene.add.graphics();
      // Pixel-style arrow button
      g.fillStyle(0x111122, 1);
      g.fillRect(-18, -18, 36, 36);
      g.lineStyle(2, 0x00ff88, 1);
      g.strokeRect(-18, -18, 36, 36);
      g.fillStyle(0x00ff88, 1);
      this._drawArrowTriangle(g, dir);
      g.setPosition(ax, ay);

      const zone = this.scene.add.zone(ax - 22, ay - 22, 44, 44).setOrigin(0);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerup', (ptr) => {
        ptr.event.stopPropagation();
        onSlide(dir);
      });
      zone.on('pointerover', () => { g.setAlpha(0.8); g.setScale(1.1); });
      zone.on('pointerout',  () => { g.setAlpha(1);   g.setScale(1); });

      this.container.add([g, zone]);
      this._arrowObjs.push(g, zone);
    });
  }

  _drawArrowTriangle(g, dir) {
    const s = 8;
    switch (dir) {
      case 'left':  g.fillTriangle(-s, 0, s, -s, s, s);  break;
      case 'right': g.fillTriangle( s, 0, -s, -s, -s, s); break;
      case 'up':    g.fillTriangle(0, -s, -s, s, s, s);   break;
      case 'down':  g.fillTriangle(0,  s, -s, -s, s, -s); break;
    }
  }

  hideArrows() {
    this._arrowObjs.forEach(o => o.destroy());
    this._arrowObjs = [];
  }

  destroy() {
    this.hideArrows();
    this.container.destroy(true);
  }
}

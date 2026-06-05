var ANIMAL_EMOJI = {
  sheep:  '🐑',
  chick:  '🐥',
  pig:    '🐷',
  rabbit: '🐰',
  cow:    '🐮',
  duck:   '🦆',
  cat:    '🐱',
  dog:    '🐶'
};

var ANIMAL_COLORS = {
  sheep:  0xf5f0e8,
  chick:  0xffdd44,
  pig:    0xffb6c1,
  rabbit: 0xe8e8ff,
  cow:    0xd4f0d4,
  duck:   0xaadd88,
  cat:    0xffe0a0,
  dog:    0xd4a060
};

var ANIMAL_DARK_COLORS = {
  sheep:  0xc8c0a8,
  chick:  0xd4aa00,
  pig:    0xe08090,
  rabbit: 0xb8b8e0,
  cow:    0x90c890,
  duck:   0x70aa50,
  cat:    0xd4a860,
  dog:    0xa06830
};

class Animal {
  constructor(scene, data, cellSize, offsetX, offsetY) {
    this.scene = scene;
    this.id = data.id;
    this.orientation = data.orientation;
    this.row = data.row;
    this.col = data.col;
    this.size = data.size;
    this.animalType = data.animal;
    this.cellSize = cellSize;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.isExiting = false;

    this.container = scene.add.container(0, 0);
    this._createVisual();
  }

  _createVisual() {
    const cs = this.cellSize;
    const pad = 4;
    const w = this.orientation === 'H' ? this.size * cs - pad * 2 : cs - pad * 2;
    const h = this.orientation === 'V' ? this.size * cs - pad * 2 : cs - pad * 2;

    const color = ANIMAL_COLORS[this.animalType];
    const darkColor = ANIMAL_DARK_COLORS[this.animalType];

    // Shadow
    this.shadow = this.scene.add.graphics();
    this.shadow.fillStyle(0x000000, 0.18);
    this.shadow.fillRoundedRect(4, 4, w, h, 10);

    // Body
    this.bg = this.scene.add.graphics();
    this.bg.fillStyle(darkColor, 1);
    this.bg.fillRoundedRect(0, 0, w, h, 10);
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(0, 0, w - 2, h - 2, 10);

    // Highlight border (hidden by default)
    this.highlight = this.scene.add.graphics();

    // Emoji label(s)
    const emoji = ANIMAL_EMOJI[this.animalType];
    const fontSize = Math.min(cs * 0.55, 28);

    if (this.size === 2) {
      const ex = this.orientation === 'H' ? cs * 0.5 : w / 2;
      const ey = this.orientation === 'V' ? cs * 0.5 : h / 2;
      const ex2 = this.orientation === 'H' ? cs * 1.5 : w / 2;
      const ey2 = this.orientation === 'V' ? cs * 1.5 : h / 2;
      this.emoji1 = this.scene.add.text(ex, ey, emoji, {
        fontSize: fontSize + 'px', align: 'center'
      }).setOrigin(0.5, 0.5);
      this.emoji2 = this.scene.add.text(ex2, ey2, emoji, {
        fontSize: fontSize + 'px', align: 'center'
      }).setOrigin(0.5, 0.5);
    } else {
      const ex = w / 2;
      const ey = h / 2;
      this.emoji1 = this.scene.add.text(ex, ey, emoji, {
        fontSize: (fontSize * 1.3) + 'px', align: 'center'
      }).setOrigin(0.5, 0.5);
    }

    this.container.add([this.shadow, this.bg, this.highlight]);
    if (this.emoji2) this.container.add(this.emoji2);
    this.container.add(this.emoji1 || []);

    // Make interactive
    const hitZone = new Phaser.Geom.Rectangle(0, 0, w, h);
    this.container.setInteractive(hitZone, Phaser.Geom.Rectangle.Contains);

    this._updatePosition();
  }

  _updatePosition() {
    const pad = 4;
    const px = this.offsetX + this.col * this.cellSize + pad;
    const py = this.offsetY + this.row * this.cellSize + pad;
    this.container.setPosition(px, py);
  }

  getPixelPosition() {
    const pad = 4;
    return {
      x: this.offsetX + this.col * this.cellSize + pad,
      y: this.offsetY + this.row * this.cellSize + pad
    };
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
    const cs = this.cellSize;
    let targetX, targetY;
    if (this.orientation === 'H') {
      this.col = newCell;
      targetX = this.offsetX + this.col * cs + pad;
      targetY = this.container.y;
    } else {
      this.row = newCell;
      targetX = this.container.x;
      targetY = this.offsetY + this.row * cs + pad;
    }
    this.scene.tweens.add({
      targets: this.container,
      x: targetX,
      y: targetY,
      duration: 80,
      ease: 'Linear'
    });
  }

  exitAnimation(direction) {
    this.isExiting = true;
    this.scene.tweens.killTweensOf(this.container);
    const cs = this.cellSize;
    const pad = 4;
    const w = this.orientation === 'H' ? this.size * cs : cs;
    const h = this.orientation === 'V' ? this.size * cs : cs;

    let targetX = this.container.x;
    let targetY = this.container.y;

    switch (direction) {
      case 'right': targetX = this.offsetX + 6 * cs + w + pad; break;
      case 'left':  targetX = this.offsetX - w - pad * 2; break;
      case 'down':  targetY = this.offsetY + 6 * cs + h + pad; break;
      case 'up':    targetY = this.offsetY - h - pad * 2; break;
    }

    this.scene.tweens.add({
      targets: this.container,
      x: targetX,
      y: targetY,
      scaleX: 0.7,
      scaleY: 0.7,
      alpha: 0,
      duration: 220,
      ease: 'Sine.easeIn',
      onComplete: () => this.destroy()
    });
  }

  setHighlight(active) {
    this.highlight.clear();
    if (active) {
      const cs = this.cellSize;
      const pad = 4;
      const w = this.orientation === 'H' ? this.size * cs - pad * 2 : cs - pad * 2;
      const h = this.orientation === 'V' ? this.size * cs - pad * 2 : cs - pad * 2;
      this.highlight.lineStyle(3, 0xffffff, 1);
      this.highlight.strokeRoundedRect(-2, -2, w + 4, h + 4, 12);
    }
  }

  destroy() {
    this.container.destroy(true);
  }
}

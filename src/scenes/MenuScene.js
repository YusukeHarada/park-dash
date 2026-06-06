var PIXEL_FONT = '"Press Start 2P", monospace';

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const prog = this._loadProgress();

    this._drawBackground(W, H);
    this._drawHeader(W);
    this._drawLevelGrid(W, prog);
    this._drawFooter(W, H);
    this._drawScanlines(W, H);
  }

  _drawBackground(W, H) {
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1a, 1);
    bg.fillRect(0, 0, W, H);
    // Dot grid
    bg.fillStyle(0x1a1a2e, 1);
    for (let y = 0; y < H; y += 16) {
      for (let x = 0; x < W; x += 16) {
        bg.fillRect(x, y, 2, 2);
      }
    }
  }

  _drawHeader(W) {
    // Header panel
    const hdr = this.add.graphics();
    hdr.fillStyle(0x000000, 1);
    hdr.fillRect(0, 0, W, 110);
    hdr.lineStyle(2, 0x00ff88, 1);
    hdr.strokeRect(0, 0, W, 110);

    // Blinking cursor effect title
    this.add.text(W / 2, 18, 'ANIMAL', {
      fontSize: '20px', fontFamily: PIXEL_FONT, color: '#00ff88'
    }).setOrigin(0.5);
    this.add.text(W / 2, 46, 'ESCAPE!', {
      fontSize: '20px', fontFamily: PIXEL_FONT, color: '#ffff00'
    }).setOrigin(0.5);
    this.add.text(W / 2, 78, '- SELECT STAGE -', {
      fontSize: '7px', fontFamily: PIXEL_FONT, color: '#888888'
    }).setOrigin(0.5);
    this.add.text(W / 2, 94, 'TAP ANIMAL > TAP ARROW / SWIPE', {
      fontSize: '5px', fontFamily: PIXEL_FONT, color: '#444466'
    }).setOrigin(0.5);
  }

  _drawLevelGrid(W, prog) {
    const cols  = 3;
    const btnW  = 112, btnH = 80;
    const gapX  = 6, gapY = 6;
    const gridW = cols * btnW + (cols - 1) * gapX;
    const startX = (W - gridW) / 2;
    const startY = 118;

    LEVELS.forEach((level, i) => {
      const col  = i % cols;
      const row  = Math.floor(i / cols);
      const x    = startX + col * (btnW + gapX);
      const y    = startY + row * (btnH + gapY);
      const stars = Math.min(3, Math.max(0, parseInt(prog[level.id]) || 0));
      const locked = level.id > 1 && !prog[level.id - 1];
      this._levelBtn(level, x, y, btnW, btnH, stars, locked);
    });
  }

  _levelBtn(level, x, y, w, h, stars, locked) {
    const gs = level.gridSize || 6;
    const borderColor = locked ? 0x223322
      : gs === 8 ? 0xff6600
      : gs === 7 ? 0x0088ff
      : 0x00ff88;
    const fillColor = locked ? 0x050d05 : 0x000d00;

    const bg = this.add.graphics();
    const drawBg = (lit) => {
      bg.clear();
      // Pixel drop shadow
      bg.fillStyle(0x000000, 0.8);
      bg.fillRect(x + 3, y + 3, w, h);
      // Main fill
      bg.fillStyle(lit ? 0x001a00 : fillColor, 1);
      bg.fillRect(x, y, w, h);
      // Pixel border (double line style)
      bg.lineStyle(2, locked ? 0x223322 : borderColor, 1);
      bg.strokeRect(x, y, w, h);
      if (!locked) {
        bg.lineStyle(1, 0x001100, 1);
        bg.strokeRect(x + 3, y + 3, w - 6, h - 6);
      }
    };
    drawBg(false);

    // Level number
    this.add.text(x + w / 2, y + 12, 'LV.' + String(level.id).padStart(2, '0'), {
      fontSize: '9px', fontFamily: PIXEL_FONT,
      color: locked ? '#223322' : '#00ff88'
    }).setOrigin(0.5);

    // Theme
    const shortTheme = level.theme.length > 6 ? level.theme.slice(0, 5) + '..' : level.theme;
    this.add.text(x + w / 2, y + 30, shortTheme, {
      fontSize: '6px', fontFamily: PIXEL_FONT,
      color: locked ? '#1a2a1a' : '#44bb44'
    }).setOrigin(0.5);

    // Grid size badge
    const badgeColor = locked ? '#1a2a1a'
      : gs === 8 ? '#ff6600'
      : gs === 7 ? '#0088ff'
      : '#ffff00';
    this.add.text(x + w / 2, y + 46, gs + 'x' + gs, {
      fontSize: '7px', fontFamily: PIXEL_FONT, color: badgeColor
    }).setOrigin(0.5);

    // Stars
    if (locked) {
      this.add.text(x + w / 2, y + 62, 'LOCK', {
        fontSize: '7px', fontFamily: PIXEL_FONT, color: '#223322'
      }).setOrigin(0.5);
    } else {
      const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      this.add.text(x + w / 2, y + 62, starStr, {
        fontSize: '10px', fontFamily: PIXEL_FONT,
        color: stars === 3 ? '#ffff00' : '#446644'
      }).setOrigin(0.5);
    }

    if (locked) return;

    const zone = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => drawBg(true));
    zone.on('pointerout',  () => drawBg(false));
    zone.on('pointerup',   () => this.scene.start('GameScene', { levelId: level.id }));
  }

  _drawFooter(W, H) {
    const footer = this.add.graphics();
    footer.fillStyle(0x000000, 1);
    footer.fillRect(0, H - 30, W, 30);
    footer.lineStyle(1, 0x002200, 1);
    footer.strokeRect(0, H - 30, W, 30);

    this.add.text(W / 2, H - 15, 'ANIMAL ESCAPE  V2.1  (C)2025', {
      fontSize: '5px', fontFamily: PIXEL_FONT, color: '#334433'
    }).setOrigin(0.5);
  }

  _drawScanlines(W, H) {
    const sl = this.add.graphics();
    sl.fillStyle(0x000000, 0.06);
    for (let y = 0; y < H; y += 4) {
      sl.fillRect(0, y, W, 2);
    }
    sl.setDepth(100);
  }

  _loadProgress() {
    try {
      return JSON.parse(localStorage.getItem('animalEscapeProgress') || '{}');
    } catch (e) { return {}; }
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const prog = this._loadProgress();

    this._drawBackground(W, H);

    // Title
    this.add.text(W / 2, 60, 'Animal Escape!', {
      fontSize: '34px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff', stroke: '#2d5a27', strokeThickness: 6, fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, 100, '動物たちを全員脱出させよう！', {
      fontSize: '14px', fontFamily: 'Arial', color: '#e0f0d0',
      stroke: '#2d5a27', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(W / 2, 124, 'タップで選択 → 矢印をタップ or スワイプ でスライド', {
      fontSize: '11px', fontFamily: 'Arial', color: '#b0d898'
    }).setOrigin(0.5);

    // Level grid: 3 columns
    const cols    = 3;
    const btnW    = 108, btnH = 76;
    const gapX    = 10, gapY = 10;
    const gridW   = cols * btnW + (cols - 1) * gapX;
    const startX  = (W - gridW) / 2;
    const startY  = 155;

    LEVELS.forEach((level, i) => {
      const col  = i % cols;
      const row  = Math.floor(i / cols);
      const x    = startX + col * (btnW + gapX);
      const y    = startY + row * (btnH + gapY);
      const stars = Math.min(3, Math.max(0, parseInt(prog[level.id]) || 0));
      const locked = level.id > 1 && !prog[level.id - 1];
      this._levelBtn(level, x, y, btnW, btnH, stars, locked);
    });

    // Deco animals
    ['🐑', '🐥', '🐷', '🐰', '🐮', '🦆'].forEach((e, i) => {
      this.add.text(
        28 + (i % 6) * (W / 6),
        H - 52, e, { fontSize: '28px' }
      ).setAlpha(0.55);
    });

    this.add.text(W / 2, H - 18, 'Animal Escape v2.0', {
      fontSize: '11px', fontFamily: 'Arial', color: '#7ab870'
    }).setOrigin(0.5);
  }

  _levelBtn(level, x, y, w, h, stars, locked) {
    const fill   = locked ? 0x2a3a28 : (stars > 0 ? 0x3a7a2a : 0x3a6a22);
    const border = locked ? 0x445544 : (stars === 3 ? 0x88dd44 : 0x6a9a50);

    const bg = this.add.graphics();
    const drawBg = (f, b) => {
      bg.clear();
      bg.fillStyle(0x000000, 0.25);
      bg.fillRoundedRect(x + 2, y + 3, w, h, 10);
      bg.fillStyle(f, 1);
      bg.fillRoundedRect(x, y, w, h, 10);
      bg.lineStyle(2, b, 1);
      bg.strokeRoundedRect(x, y, w, h, 10);
    };
    drawBg(fill, border);

    // Level number
    this.add.text(x + w / 2, y + 14, `Lv.${level.id}`, {
      fontSize: '16px', fontFamily: 'Arial Black, Arial',
      color: locked ? '#556655' : '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Theme name
    this.add.text(x + w / 2, y + 34, level.theme, {
      fontSize: '11px', fontFamily: 'Arial',
      color: locked ? '#445544' : '#aaddaa'
    }).setOrigin(0.5);

    // Stars or lock
    if (locked) {
      this.add.text(x + w / 2, y + 55, '🔒', { fontSize: '16px' }).setOrigin(0.5);
    } else {
      const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      this.add.text(x + w / 2, y + 54, starStr, { fontSize: '13px' }).setOrigin(0.5);
    }

    if (locked) return;

    const zone = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => drawBg(
      stars > 0 ? 0x4a8a3a : 0x4a7a32,
      stars === 3 ? 0xffffff : 0x88cc55
    ));
    zone.on('pointerout', () => drawBg(fill, border));
    zone.on('pointerup', () => this.scene.start('GameScene', { levelId: level.id }));
  }

  _drawBackground(W, H) {
    const bg = this.add.graphics();
    bg.fillStyle(0x3a7a30, 1);
    bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x4a8a40, 0.35);
    for (let i = 0; i < 18; i++) {
      bg.fillEllipse((i * 53 + 17) % W, (i * 71 + 31) % H,
        60 + (i * 13) % 40, 30 + (i * 7) % 20);
    }
    // Header darken
    bg.fillStyle(0x1a4a18, 0.72);
    bg.fillRect(0, 0, W, 140);
  }

  _loadProgress() {
    try {
      return JSON.parse(localStorage.getItem('animalEscapeProgress') || '{}');
    } catch (e) { return {}; }
  }
}

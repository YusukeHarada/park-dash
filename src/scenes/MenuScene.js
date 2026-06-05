class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this._drawBackground(W, H);

    // Title
    this.add.text(W / 2, 80, 'Animal Escape!', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#2d5a27',
      strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, 125, '動物たちを全員脱出させよう！', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#e8f5e0',
      stroke: '#2d5a27',
      strokeThickness: 3
    }).setOrigin(0.5);

    // How to play
    this.add.text(W / 2, 160, '← ドラッグでスライド →  柵の外へ出せばOK！', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#c8e8b0',
    }).setOrigin(0.5);

    const completed = this._loadProgress();
    const cols = 2;
    const btnW = 150;
    const btnH = 80;
    const gapX = 20;
    const gapY = 20;
    const startX = (W - (cols * btnW + (cols - 1) * gapX)) / 2;
    const startY = 210;

    LEVELS.forEach((level, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (btnW + gapX);
      const y = startY + row * (btnH + gapY);
      this._createLevelButton(level, x, y, btnW, btnH, completed.has(level.id));
    });

    // Decorative animals
    const deco = ['🐑', '🐥', '🐷', '🐰', '🐮', '🦆'];
    deco.forEach((emoji, i) => {
      const ex = 30 + (i % 3) * 130;
      const ey = H - 120 + Math.floor(i / 3) * 55;
      this.add.text(ex, ey, emoji, { fontSize: '32px' }).setAlpha(0.6);
    });

    this.add.text(W / 2, H - 30, 'Animal Escape v1.0', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#7ab870',
    }).setOrigin(0.5);
  }

  _createLevelButton(level, x, y, w, h, isCompleted) {
    const graphics = this.add.graphics();
    const borderColor = isCompleted ? 0x88cc44 : 0x8ab870;
    const fillColor = isCompleted ? 0x4a8a2a : 0x3a6a22;

    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRoundedRect(x + 3, y + 3, w, h, 12);
    graphics.fillStyle(fillColor, 1);
    graphics.fillRoundedRect(x, y, w, h, 12);
    graphics.lineStyle(2, borderColor, 1);
    graphics.strokeRoundedRect(x, y, w, h, 12);

    this.add.text(x + w / 2, y + 18, `Level ${level.id}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(x + w / 2, y + 42, level.theme, {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#c8e8a0'
    }).setOrigin(0.5);

    if (isCompleted) {
      this.add.text(x + w - 18, y + 10, '⭐', { fontSize: '16px' }).setOrigin(0.5);
    }

    // Invisible interactive zone
    const zone = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      graphics.clear();
      graphics.fillStyle(0x000000, 0.3);
      graphics.fillRoundedRect(x + 3, y + 3, w, h, 12);
      graphics.fillStyle(isCompleted ? 0x5a9a3a : 0x4a7a32, 1);
      graphics.fillRoundedRect(x, y, w, h, 12);
      graphics.lineStyle(3, 0xffffff, 0.8);
      graphics.strokeRoundedRect(x, y, w, h, 12);
    });

    zone.on('pointerout', () => {
      graphics.clear();
      graphics.fillStyle(0x000000, 0.3);
      graphics.fillRoundedRect(x + 3, y + 3, w, h, 12);
      graphics.fillStyle(isCompleted ? 0x4a8a2a : 0x3a6a22, 1);
      graphics.fillRoundedRect(x, y, w, h, 12);
      graphics.lineStyle(2, borderColor, 1);
      graphics.strokeRoundedRect(x, y, w, h, 12);
    });

    zone.on('pointerup', () => {
      this.scene.start('GameScene', { levelId: level.id });
    });
  }

  _drawBackground(W, H) {
    // Grass background
    const bg = this.add.graphics();
    bg.fillStyle(0x3a7a30, 1);
    bg.fillRect(0, 0, W, H);

    // Lighter grass patches
    bg.fillStyle(0x4a8a40, 0.4);
    for (let i = 0; i < 20; i++) {
      const gx = (i * 53 + 17) % W;
      const gy = (i * 71 + 31) % H;
      bg.fillEllipse(gx, gy, 60 + (i * 13) % 40, 30 + (i * 7) % 20);
    }

    // Top header bg
    const header = this.add.graphics();
    header.fillStyle(0x1a4a18, 0.7);
    header.fillRect(0, 0, W, 175);
  }

  _loadProgress() {
    try {
      const raw = localStorage.getItem('animalEscapeProgress') || '[]';
      return new Set(JSON.parse(raw));
    } catch (e) {
      return new Set();
    }
  }
}

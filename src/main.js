var config = {
  type: Phaser.CANVAS,
  width: 400,
  height: 700,
  backgroundColor: '#2d5a27',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: document.body
  },
  scene: [MenuScene, GameScene],
  input: {
    touch: { capture: true }
  }
};

var game = new Phaser.Game(config);

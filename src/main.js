var config = {
  type: Phaser.CANVAS,
  width: 400,
  height: 700,
  backgroundColor: '#2d5a27',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    expandParent: false
  },
  scene: [MenuScene, GameScene],
  input: {
    touch: { capture: true },
    activePointers: 2
  }
};

var game = new Phaser.Game(config);

// 起動成功したらローディング表示を消す
game.events.once('ready', function() {
  var el = document.getElementById('error-msg');
  if (el) el.style.display = 'none';
});

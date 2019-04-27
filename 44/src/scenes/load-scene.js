const Phaser = require('phaser');


class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-load' });
    }

    create() {
        this.scene.start('scene-title');
    }

    preload() {
        /* load game assets */
        this.load.image('background-title', './static/res/img/background-title-temp.png');

        this.load.spritesheet('rock-paper-scissors', './static/res/img/sprite-sheet-rock-paper-scissors.png', {
            frameHeight: 216,
            frameWidth: 248
        });

        this.load.spritesheet('death', './static/res/img/sprite-sheet-death.png', {
            frameHeight: 128,
            frameWidth: 128
        });

        this.load.audio('sfx-start', './static/res/sfx/start.wav');
        this.load.audio('sfx-title', './static/res/sfx/title.wav');

        /* create loading bar */
        let loadingBar = this.add.graphics({ fillStyle: { color: 0xffffff } });

        /* loader events */
        this.load.on('progress', (percentage) => {
            loadingBar.fillRect(0, this.game.renderer.height - 64, this.game.renderer.width * percentage, 32);
        });
    }
}


module.exports = { LoadScene };

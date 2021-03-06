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

        /* audio */
        this.load.audio('sfx-death', './static/res/sfx/death.ogg');
        this.load.audio('sfx-point', './static/res/sfx/point.wav');
        this.load.audio('sfx-shop', './static/res/sfx/shop.mp3');
        this.load.audio('sfx-start', './static/res/sfx/start.wav');
        this.load.audio('sfx-title', './static/res/sfx/title.wav');
        this.load.audio('sfx-tie', './static/res/sfx/tie.wav');
        this.load.audio('sfx-win', './static/res/sfx/win.mp3');

        /* progress bar */
        let progressBar = this.add.graphics({ fillStyle: { color: 0xffffff } });

        /* loader events */
        this.load.on('progress', (percentage) => {
            progressBar.fillRect(0, this.game.renderer.height - 64, this.game.renderer.width * percentage, 32);
        });
    }
}


module.exports = { LoadScene };

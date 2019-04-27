const Phaser = require('phaser');


class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-load' });
    }

    init() {
        /* TODO: */
    }

    create(data) {
        /* TODO: */
        this.scene.start('scene-title', "Hello, Title scene!");
    }

    preload() {
        /* load game assets */
        this.load.image('background-title', './static/res/img/background-title-temp.png');

        this.load.spritesheet('death', './static/res/img/sprite-sheet-death.png', {
            frameHeight: 128,
            frameWidth: 128
        });

        this.load.audio('sfx-ominous', './static/res/sfx/ominous.wav');

        /* create loading bar */
        let loadingBar = this.add.graphics({
            fillStyle: { color: 0xffffff }
        });

        /* loader events */
        this.load.on('progress', (percentage) => {
            loadingBar.fillRect(0, this.game.renderer.height - 64, this.game.renderer.width * percentage, 32);
        });
    }

    update(time, delta) {
        /* TODO: */
    }
}


module.exports = { LoadScene };

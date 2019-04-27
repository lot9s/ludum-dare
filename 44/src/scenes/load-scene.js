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
        /* TODO: */
    }

    update(time, delta) {
        /* TODO: */
    }
}


module.exports = { LoadScene };

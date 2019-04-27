const Phaser = require('phaser');


class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-title' });
    }

    init(data) {
        console.log(data);
    }

    create(data) {
        /* TODO: */
    }

    preload() {
        /* TODO: */
    }

    update(time, delta) {
        /* TODO: */
    }
}


module.exports = { TitleScene };

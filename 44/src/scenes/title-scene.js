const Phaser = require('phaser');


class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-title' });
    }

    init(data) {
        console.log(data);
    }

    create(data) {
        this.add.image(0, 0, 'background-title').setOrigin(0);
    }

    preload() {
        /* TODO: */
    }

    update(time, delta) {
        /* TODO: */
    }
}


module.exports = { TitleScene };

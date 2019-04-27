const Phaser = require('phaser');


class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: "scene-shop" });
    }

    create() {
        /* dialogue box */
        let messageBox = this.add.graphics({ fillStyle: { color: 0xffffff } });
        messageBox.fillRoundedRect(32, 32, this.game.renderer.width - 64, this.game.renderer.height - 64, 8);
    }
}


module.exports = { ShopScene };

const Phaser = require('phaser');


class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: "scene-death" });
    }

    create() {
        this.add.text(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2, "NEVER BORN", 
            { fontSize: '96px', fill: '#bb0000' }
        ).setOrigin(0.5);
    }
}


module.exports = { DeathScene };

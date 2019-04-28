const Phaser = require('phaser');


class LifeScene extends Phaser.Scene {
    constructor() {
        super({ key: "scene-life" });
    }

    create() {
        /* graphics */
        let messageBox = this.add.graphics({ fillStyle: { color: 0xffffff } });
        messageBox.fillRect(0, 0, this.game.renderer.width, this.game.renderer.height);

        /* text */
        this.add.text(
            this.game.renderer.width / 2,
            this.game.renderer.height / 2, "YOU LIVED", 
            { fontSize: '96px', fill: '#000000' }
        ).setOrigin(0.5);

        /* audio */
        this.sound.play('sfx-win', { volume: 0.75 });

        /* restart */
        this.time.addEvent({
            delay: 5000,
            callback: function() { this.scene.start('scene-title'); },
            callbackScope: this
        });
    }
}


module.exports = { LifeScene };

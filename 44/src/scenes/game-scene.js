const Phaser = require('phaser');


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-game' });

        this.deathSprite = {};
    }

    create() {
        this.deathSprite = this.add.sprite(this.game.renderer.width / 2, 160, 'death', 0);

        /* input icons */
        let rockSprite = this.add.sprite(0, 0, 'rock-paper-scissors', 1).setOrigin(0, 0.5);
        rockSprite.setScale(0.5);
        rockSprite.setPosition(214, 354)

        let paperSprite = this.add.sprite(0, 0, 'rock-paper-scissors', 0).setOrigin(0, 0.5);
        paperSprite.setScale(0.5);
        paperSprite.setPosition(338, 354);
        
        let scissorsSprite = this.add.sprite(0, 0, 'rock-paper-scissors', 2).setOrigin(0, 0.5);
        scissorsSprite.setScale(0.5);
        scissorsSprite.setPosition(462, 354);

        /* dialogue box */
        let messageBox = this.add.graphics({ fillStyle: { color: 0xffffff } });
        messageBox.fillRoundedRect(32, this.game.renderer.height - 160, this.game.renderer.width - 64, 128, 8);

        /* animations */
        this.anims.create({
            key: "death-float",
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('death', {
                frames: [0,1,2,3,4,5]
            })
        });

        this.deathSprite.play('death-float');
    }
}


module.exports = { GameScene };

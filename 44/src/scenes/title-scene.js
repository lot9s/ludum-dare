const Phaser = require('phaser');


class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-title' });

        this.sfxStart = {};
        this.sfxTitle = {};
    }

    create() {
        this.add.image(0, 0, 'background-title').setOrigin(0);

        /* 'O' */
        let oSprite = this.add.sprite(460, 265, 'death', 9);
        oSprite.setScale(0.37);
        oSprite.setDepth(1);

        let hoverSprite = this.add.sprite(0, 0, 'death', 3);
        hoverSprite.setScale(0.33);
        hoverSprite.setVisible(false);


        /* text */
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 3, 'What Death Has', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2, (this.game.renderer.height / 3) + 64, 'in Store', { fontSize: '64px' }).setOrigin(0.5);

        let buttonPlay = this.add.text(this.game.renderer.width / 2, 380, 'Play', {
            fontSize: '24px'
        }).setOrigin(0.5);


        /* audio */
        this.sfxStart = this.sound.add('sfx-start', { delay: 0.5, volume: 0.66 });
        this.sfxTitle = this.sound.add('sfx-title', { loop: true });

        this.sfxTitle.play();


        /* animations */
        this.anims.create({
            key: "death-peak",
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('death', {
                frames: [3,4]
            })
        });

        
        /* pointer events */
        buttonPlay.setInteractive();
        buttonPlay.on('pointerover', () => {
            hoverSprite.setVisible(true);
            hoverSprite.play('death-peak');
            hoverSprite.x = buttonPlay.x - (buttonPlay.width / 2) - 32;
            hoverSprite.y = buttonPlay.y;
        });

        buttonPlay.on('pointerout', () => { hoverSprite.setVisible(false); });
        buttonPlay.on('pointerup', () =>  { 
            this.sfxStart.play();
            this.sfxTitle.stop();
            this.scene.start('scene-game'); 
        });
    }
}


module.exports = { TitleScene };

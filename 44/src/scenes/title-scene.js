const Phaser = require('phaser');


class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-title' });

        this.sfxStart = {};
        this.sfxTitle = {};
    }

    create() {
        this.add.image(0, 0, 'background-title').setOrigin(0);

        let hoverSprite = this.add.sprite(0, 0, 'death', 3);
        hoverSprite.setScale(0.33);
        hoverSprite.setVisible(false);


        /* text */
        let buttonPlay = this.add.text(this.game.renderer.width / 2, 380, 'Play', {
            fontSize: '24px'
        });

        buttonPlay.setOrigin(0.5);
        
        let buttonOptions = this.add.text(this.game.renderer.width / 2, 412, 'Options', {
            fontSize: '24px'
        });
        
        buttonOptions.setOrigin(0.5);


        /* audio */
        this.sfxStart = this.sound.add('sfx-start', { delay: 0.5 });
        this.sfxTitle = this.sound.add('sfx-title', { loop: true });


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
            /*this.sfxStart.play();*/
            this.sfxTitle.stop();
            this.scene.start('scene-game'); 
        });

        buttonOptions.setInteractive();
        buttonOptions.on('pointerover', () => {
            hoverSprite.setVisible(true);
            hoverSprite.play('death-peak');
            hoverSprite.x = buttonOptions.x - (buttonOptions.width / 2) - 32;
            hoverSprite.y = buttonOptions.y;
        });

        buttonOptions.on('pointerout', () => { hoverSprite.setVisible(false); });
        buttonOptions.on('pointerup', () =>  { console.log('Play | up'); });
    }
}


module.exports = { TitleScene };

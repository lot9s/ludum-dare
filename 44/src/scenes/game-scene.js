const Phaser = require('phaser');


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'scene-game' });

        this.deathSprite = {};
        this.dialogueText = {};

        this.dialogueTexts = [
            `Death is feeling...playful. Precious soul, choose\nwisely! Your as yet unlived life is at stake.`,
            `"A...tie!"`,
            `"Double...or...Death?"`
        ];

        this.storeText = {};

        this.points = 0;
        this.wins = 0;

        this.sfxPoint = {};
    }

    create() {
        /* --- reset --- */
        this.points = 0;
        this.wins = 0;

        /* death */
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

        /* text */
        this.dialogueText = this.add.text(48, 480, this.dialogueTexts[0], { fontSize: '24px', fill: '#000000' });
        
        this.storeText = this.add.text(64, 368, "[Store]", { fontSize: '24px', fill: '#ffffff' });
        this.storeText.setVisible(false);

        /* audio */
        this.sfxPoint = this.sound.add('sfx-point', { volume: 0.75 });

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

        /* pointer events */
        rockSprite.setInteractive();
        rockSprite.on('pointerup', () => { this.rockPaperScissors(0); });
        rockSprite.on('pointerout', () => { rockSprite.setTexture('rock-paper-scissors', 1); });
        rockSprite.on('pointerover', () => { rockSprite.setTexture('rock-paper-scissors', 7); });

        paperSprite.setInteractive();
        paperSprite.on('pointerup', () => { this.rockPaperScissors(1); });
        paperSprite.on('pointerout', () => { paperSprite.setTexture('rock-paper-scissors', 0); });
        paperSprite.on('pointerover', () => { paperSprite.setTexture('rock-paper-scissors', 6); });

        scissorsSprite.setInteractive();
        scissorsSprite.on('pointerup', () => { this.rockPaperScissors(2); });
        scissorsSprite.on('pointerout', () => { scissorsSprite.setTexture('rock-paper-scissors', 2); });
        scissorsSprite.on('pointerover', () => { scissorsSprite.setTexture('rock-paper-scissors', 8); });
    }

    rockPaperScissors(choice) {
        /* 0 - rock; 1 - paper; 2 - scissors */
        let deathChoice = Phaser.Math.RND.integerInRange(0,2);

        /* implement tie */
        if (choice === deathChoice) {
            this.dialogueText.setText(this.dialogueTexts[1]);
            return;
        }

        /* implement win */
        if ((choice === 0 && deathChoice === 2) || (choice === 1 && deathChoice === 0) || (choice === 2 && deathChoice === 1)) {
            this.sfxPoint.play();

            /* update score */
            this.points = Math.pow(2, this.wins);
            this.wins += 1;
            
            /* update text */
            this.dialogueText.setText(this.dialogueTexts[2]);

            /* display store button */
            this.storeText.setInteractive();
            this.storeText.on('pointerup', () => { this.scene.start('scene-shop', { 'points': this.points }); });
            this.storeText.setVisible(true);
        
        /* implement loss */
        } else {
            this.scene.start('scene-death');
        }
    }
}


module.exports = { GameScene };

const Phaser = require('phaser');


class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: "scene-shop" });

        this.perks = [
            { cost: 1,  selected: false, description: `Always smell nice.` },
            { cost: 2,  selected: false, description: `Know if you'll like something before trying it.` },
            { cost: 5,  selected: false, description: `Lucky.` },
            { cost: 10, selected: false, description: `2x Lifespan.` }
        ];

        this.points = 0;
        this.spentPoints = 0;

        this.sfxShop = {};
        this.sfxWin = {};
    }

    create(data) {
        /* --- reset --- */
        this.points = data.points;
        this.spentPoints = 0;
        for (let i = 0; i < this.perks.length; i++) {
            this.perks[i].selected = false;
        }

        /* graphics */
        let messageBox = this.add.graphics({ fillStyle: { color: 0xffffff } });
        messageBox.fillRoundedRect(32, 32, this.game.renderer.width - 64, this.game.renderer.height - 64, 8);
    
        /* text */
        this.add.text(56, 64, "You have won a moderate amount of life\npoints from Death. You may choose to spend these\npoints on perks, but be sure that you do not\nspend too much. Heh heh...", {
            fontSize: '24px', 
            fill: '#000000'
        });

        this.add.text(48, 220, "Perks:", { fontSize: '48px', fontWeight: 'bold', fill: '#000000' });

        let perk0 = this.add.text(56, 282, this.perks[0].description, { fontSize: '24px', fill: '#000000' });
        let perk1 = this.add.text(56, 322, this.perks[1].description, { fontSize: '24px', fill: '#000000' });
        let perk2 = this.add.text(56, 362, this.perks[2].description, { fontSize: '24px', fill: '#000000' });
        let perk3 = this.add.text(56, 402, this.perks[3].description, { fontSize: '24px', fill: '#000000' });

        let buttonWin = this.add.text(544, 496, "[Birth]", { fontSize: '36px', fontWeight: 'bold', fill: '#000000' });


        /* audio */
        this.sfxShop = this.sound.add('sfx-shop', { volume: 0.75, loop: true });
        this.sfxWin = this.sound.add('sfx-win', { volume: 0.75 });

        this.sfxShop.play();

        /* pointer events */
        perk0.setInteractive();
        perk0.on('pointerout', () => { if (!this.perks[0].selected) { perk0.setStyle({ fill: '#000000' }); } });
        perk0.on('pointerover', () => { perk0.setStyle({ fill: '#00bb00' }); });
        perk0.on('pointerup', () => {
            if (!this.perks[0].selected) {
                this.perks[0].selected = true;
                this.spentPoints += this.perks[0].cost;
            }

            perk0.setStyle({ fill: '#00bb00' });
        });

        perk1.setInteractive();
        perk1.on('pointerout', () => { if (!this.perks[1].selected) { perk1.setStyle({ fill: '#000000' }); } });
        perk1.on('pointerover', () => { perk1.setStyle({ fill: '#00bb00' }); });
        perk1.on('pointerup', () => {
            if (!this.perks[1].selected) {
                this.perks[1].selected = true;
                this.spentPoints += this.perks[1].cost;
            }

            perk1.setStyle({ fill: '#00bb00' });
        });

        perk2.setInteractive();
        perk2.on('pointerout', () => { if (!this.perks[2].selected) { perk2.setStyle({ fill: '#000000' }); } });
        perk2.on('pointerover', () => { perk2.setStyle({ fill: '#00bb00' }); });
        perk2.on('pointerup', () => {
            if (!this.perks[2].selected) {
                this.perks[2].selected = true;
                this.spentPoints += this.perks[2].cost;
            }

            perk2.setStyle({ fill: '#00bb00' });
        });

        perk3.setInteractive();
        perk3.on('pointerout', () => { if (!this.perks[3].selected) { perk3.setStyle({ fill: '#000000' }); } });
        perk3.on('pointerover', () => { perk3.setStyle({ fill: '#00bb00' }); });
        perk3.on('pointerup', () => {
            if (!this.perks[3].selected) {
                this.perks[3].selected = true;
                this.spentPoints += this.perks[3].cost;
            }

            perk3.setStyle({ fill: '#00bb00'});
        });

        buttonWin.setInteractive();
        buttonWin.on('pointerup', () => { 
            /* win the game */
            this.time.addEvent({
                delay: 2000,
                callback: function() { 
                    this.sfxShop.stop();

                    if (this.points - this.spentPoints <= 0) { 
                        this.scene.start('scene-death'); 
                    } else {
                        this.sfxWin.play();
                        this.scene.start('scene-title');
                    }
                },
                callbackScope: this
            });
        });

        buttonWin.on('pointerout', () => { buttonWin.setStyle({ fill: '#000000' }); });
        buttonWin.on('pointerover', () => { buttonWin.setStyle({ fill: '#00bb00' }); });
    }
}


module.exports = { ShopScene };

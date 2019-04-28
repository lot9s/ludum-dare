const Phaser = require('phaser');


class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: "scene-shop" });

        this.perks = [
            { cost: 1, description: `Always smell nice.` },
            { cost: 2, description: `Know if you'll like something before trying it.` },
            { cost: 5, description: `Lucky.` },
            { cost: 10, description: `2x Lifespan.` }
        ];
    }

    create() {
        /* shop box */
        let messageBox = this.add.graphics({ fillStyle: { color: 0xffffff } });
        messageBox.fillRoundedRect(32, 32, this.game.renderer.width - 64, this.game.renderer.height - 64, 8);
    
        /* perks */
        this.add.text(56, 64, "You have won a moderate amount of life\npoints from Death. You may choose to spend these\npoints on perks, but be sure that you do not\nspend too much. Heh heh...", {
            fontSize: '24px', 
            fill: '#000000'
        });

        this.add.text(48, 220, "Perks:", { fontSize: '48px', fontWeight: 'bold', fill: '#000000' });

        this.add.text(56, 282, this.perks[0].description, { fontSize: '24px', fill: '#000000' });
        this.add.text(56, 322, this.perks[1].description, { fontSize: '24px', fill: '#000000' });
        this.add.text(56, 362, this.perks[2].description, { fontSize: '24px', fill: '#000000' });
        this.add.text(56, 402, this.perks[3].description, { fontSize: '24px', fill: '#000000' });

        /* birth */
        this.add.text(544, 496, "[Birth]", { fontSize: '36px', fontWeight: 'bold', fill: '#000000' });
    }
}


module.exports = { ShopScene };

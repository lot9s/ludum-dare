const Phaser = require('phaser');

const { DeathScene } = require('./scenes/death-scene.js');
const { GameScene } = require('./scenes/game-scene.js');
const { LoadScene } = require('./scenes/load-scene.js');
const { TitleScene } = require('./scenes/title-scene.js');
const { ShopScene } = require('./scenes/shop-scene.js');


let config = {
    version: '0.1.0',
    title: 'WIP',
    width: 800,
    height: 600,
    parent: 'game',
    scene: [ LoadScene, TitleScene, GameScene, ShopScene, DeathScene ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    render: { pixelArt: true },
    type: Phaser.AUTO, 
};


new Phaser.Game(config);

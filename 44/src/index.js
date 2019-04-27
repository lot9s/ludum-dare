const Phaser = require('phaser');

const { LoadScene } = require('./scenes/load-scene.js');
const { TitleScene } = require('./scenes/title-scene.js');


let config = {
    version: '0.0.2',
    title: 'WIP',
    width: 800,
    height: 600,
    parent: 'game',
    scene: [ LoadScene, TitleScene ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 200
            }
        }
    },
    type: Phaser.AUTO, 
};


new Phaser.Game(config);

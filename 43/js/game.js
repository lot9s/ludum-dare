/* phaser 3 configuration */
let config = {
    width: 640,
    height: 480,
    parent: 'game',
    scene: {
        preload: preload,
        create: create
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    type: Phaser.AUTO, 
}

/* phaser 3 game */
let game = new Phaser.Game(config);

function create() {

}

function preload() {
    
}

function render() {

}

function update() {

}
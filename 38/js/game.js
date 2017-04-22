let avatar = null;
let ground = null;

window.onload = function() {
  /*
    Note that this html file is set to pull down Phaser 2.5.0 from the
    JS Delivr CDN. Although it will work fine with this tutorial, it's
    almost certainly not the most current version. Be sure to replace it
    with an updated version before you start experimenting with adding your
    own code.
  */
  var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game', {
    preload: preload, 
    create: create,
    update: update
  });

  function create () {
    // --- for debugging purposes only ---
    game.stage.backgroundColor = "#00ffff";

    // add sprites
    game.add.sprite(0, 0, 'background');
    ground = game.add.sprite(100, 330, 'ground');
    avatar = game.add.sprite(312, 250, 'avatar');

    // add physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable([ground, avatar]);

    // adjust settings for ground
    ground.body.immovable = true;

    // adjust settings for avatar
    avatar.body.bounce.y = 0.1;
    avatar.body.gravity.y = 100;
    avatar.body.collideWorldBounds = true;
  }

  function preload () {
    game.load.image('background', 'res/img/background.png');
    game.load.image('ground', 'res/img/ground.png');
    game.load.image('avatar', 'res/img/avatar.png');
  }

  function update() {
    // add collision detection
    game.physics.arcade.collide(avatar, ground);
  }
};
let game = null;
let cursors = null;

let avatar = null;
let walls = null;
let ground = null;

let bootsOnGround = false;


window.onload = function() {
  game = new Phaser.Game(640, 480, Phaser.AUTO, 'game', {
    preload: preload, 
    create: create,
    update: update,
    render: render
  });

  function create () {
    // --- for debugging purposes only ---
    game.stage.backgroundColor = "#00ffff";

    // get keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
    cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);

    // add sprites
    game.add.sprite(0, 0, 'background');
    ground = game.add.sprite(100, 330, 'ground');
    avatar = game.add.sprite(312, 250, 'avatar');

    let keyboard = game.add.sprite(160, 350, 'keyboard');
    keyboard.scale.setTo(0.5, 0.5);

    // add groups
    walls = game.add.group();

    // add physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable([ground, avatar]);

    // adjust settings for ground
    ground.body.immovable = true;

    // adjust settings for walls
    walls.enableBody = true;

    let roof = walls.create(110, 20, 'roof');
    roof.body.immovable = true;

    let wall_l = walls.create(80, 50, 'wall');
    wall_l.body.immovable = true;

    let wall_r = walls.create(532, 50, 'wall');
    wall_r.body.immovable = true;

    // adjust settings for avatar
    avatar.body.setSize(32, 32, -8, -8);
    avatar.body.collideWorldBounds = true;
    avatar.body.bounce.y = 0.1;
    avatar.body.gravity.y = 100;
  }

  function handleInput() {
    let arrowKeysDown = cursors.left.isDown || cursors.right.isDown;
    let wadKeysDown = cursors.w.isDown || cursors.a.isDown || cursors.d.isDown

    // magnetism, up
    if (cursors.w.isDown) {
      avatar.body.velocity.y = -1000;
    }

    // magnetism, left
    if (cursors.a.isDown) {
      avatar.body.velocity.x = -1000;
    }

    // magnetism, right
    if (cursors.d.isDown) {
      avatar.body.velocity.x = 1000;
    }

    // left movement
    if (bootsOnGround && cursors.left.isDown) {
      avatar.body.velocity.x = -100;
    } 

    // right movement
    if (bootsOnGround && cursors.right.isDown) {
      avatar.body.velocity.x = 100;
    }

    //no movement
    if (bootsOnGround && !arrowKeysDown && !wadKeysDown) {
      avatar.body.velocity.x = 0;
    }
  }

  function preload () {
    game.load.image('background', 'res/img/background.png');
    game.load.image('keyboard', 'res/img/keyboard.png');
    game.load.image('roof', 'res/img/roof.png');
    game.load.image('wall', 'res/img/wall.png');
    game.load.image('ground', 'res/img/ground.png');
    game.load.image('avatar', 'res/img/avatar.png');
  }

  function render() {
    // --- for debugging purposes only ---
    game.debug.body(avatar);
  }

  function update() {
    // add collision detection
    bootsOnGround = game.physics.arcade.collide(avatar, ground);
    game.physics.arcade.collide(avatar, walls);

    handleInput();
  }
};
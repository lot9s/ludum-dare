let game = null;

let cursors = null;


// ui
let barEnergy = null;
let energy = 1000;
let score = 0;


// background
let walls = null;
let ground = null;


// enemies
let enemies = [];
let enemyTimer = null;


// avatar
let avatar = null;

let bootsOnGround = false;
let wadCount = 0;



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

    createControls();

    // add sprites
    game.add.sprite(0, 0, 'background');

    game.add.sprite(583, 48, 'bar-container');
    barEnergy = game.add.sprite(585, 50, 'bar-energy');

    let keyboard = game.add.sprite(160, 367, 'keyboard');
    keyboard.scale.setTo(0.5, 0.5);

    avatar = game.add.sprite(312, 250, 'avatar');

    ground = game.add.sprite(100, 330, 'ground');

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
    roof.scale.setTo(1.2, 1.0);
    roof.x = 70;
    roof.body.immovable = true;

    let wall_l = walls.create(80, 50, 'wall');
    wall_l.body.immovable = true;

    let wall_r = walls.create(532, 50, 'wall');
    wall_r.body.immovable = true;

    // adjust settings for avatar
    avatar.body.setSize(16, 18);
    avatar.body.collideWorldBounds = true;
    avatar.body.bounce.y = 0.1;
    avatar.body.gravity.y = 100;

    // adjust settings for enemies
    enemyTimer = game.time.create(false);
    enemyTimer.loop(1000, spawnEnemy);
    enemyTimer.start();
  }

  function createControls() {
    cursors = game.input.keyboard.createCursorKeys();

    cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    cursors.w.onDown.add(wadOnDown);
    cursors.w.onUp.add(wadOnUp);

    cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors.a.onDown.add(wadOnDown);
    cursors.a.onUp.add(wadOnUp);

    cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors.d.onDown.add(wadOnDown);
    cursors.d.onUp.add(wadOnUp);
  }

  function createStage() {
    let keyboard = game.add.sprite(160, 367, 'keyboard');
    keyboard.scale.setTo(0.5, 0.5);
  }

  function handleInput() {
    let arrowKeysDown = cursors.left.isDown || cursors.right.isDown;
    let wadKeysDown = cursors.w.isDown || cursors.a.isDown || cursors.d.isDown

    // --- fast movement ---
    if (energy > 0) {
      // magnetism, up
      if (cursors.w.isDown) {
        avatar.body.velocity.y = -1000;
        energy = Math.max(0, energy - 5);
      }

      // magnetism, left
      if (cursors.a.isDown) {
        avatar.body.velocity.x = -1000;
        energy = Math.max(0, energy - 5);
      }

      // magnetism, right
      if (cursors.d.isDown) {
        avatar.body.velocity.x = 1000;
        energy = Math.max(0, energy - 5);
      }
    }

    // --- movement ---
    // left movement
    if (bootsOnGround && cursors.left.isDown) {
      avatar.body.velocity.x = -100;
    } 

    // right movement
    if (bootsOnGround && cursors.right.isDown) {
      avatar.body.velocity.x = 100;
    }

    // --- rest ---
    //no movement
    if (bootsOnGround && !arrowKeysDown && !wadKeysDown) {
      avatar.body.velocity.x = 0;
      energy = Math.min(1000, energy + 2.5)
    }
  }

  function preload () {
    // ui
    game.load.image('background', 'res/img/background.png');
    game.load.image('keyboard', 'res/img/keyboard.png');
    game.load.image('bar-container', 'res/img/bar-container.png');
    game.load.image('bar-energy', 'res/img/bar-energy.png');

    // environment
    game.load.image('roof', 'res/img/roof.png');
    game.load.image('wall', 'res/img/wall.png');
    game.load.image('ground', 'res/img/ground.png');

    // enemy
    game.load.image('enemy', 'res/img/enemy.png');

    // avatar
    game.load.image('avatar', 'res/img/avatar.png');
    game.load.image('avatar-magnet', 'res/img/avatar-magnet.png');
  }

  function render() {
    // --- for debugging purposes only ---
    //game.debug.body(avatar);

    // render energy bar
    barEnergy.scale.setTo(1, energy / 1000.0);

    // render avatar
    if (energy == 0) {
      avatar.loadTexture('avatar');
    }
  }

  function spawnEnemy() {
    let enemy = game.add.sprite(game.rnd.between(111, 529), 
                                game.rnd.between( 51, 329), 
                                'enemy');


    game.physics.arcade.enable(enemy);
    enemy.body.bounce.y = 0.5;
    enemy.body.gravity.y = 10;

    enemies.push(enemy);
  }

  function update() {
    // detect collisions between avatar and the environment
    bootsOnGround = game.physics.arcade.collide(avatar, ground);
    game.physics.arcade.collide(avatar, walls);

    for (var i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];

      // detect collisions between enemies and the environment
      game.physics.arcade.collide(enemy, walls);
      game.physics.arcade.collide(enemy, ground);

      // detect collisions between avatar and enemies
      if (game.physics.arcade.collide(avatar, enemies[i])) {
        if (wadCount > 0) {
          // enemy defeat!
          enemy.kill();
          enemies.splice(i, 1);

          score = score + 1;
        } else {
          // player defeat!
          //avatar.kill();
        }
      }
    }

    handleInput();
  }

  function wadOnDown() {
    if (wadCount == 0) {
      avatar.loadTexture('avatar-magnet');
    }

    wadCount = wadCount + 1;
  }

  function wadOnUp() {
    wadCount = wadCount - 1;

    if (wadCount == 0) {
      avatar.loadTexture('avatar');
    }
  }
};
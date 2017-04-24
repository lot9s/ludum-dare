/* --- global variables --- */
let game = null;

let cursors = null;


// ui
let barEnergy = null;
let energy = 1000;

let scoreTenThousandsText = null;
let scoreThousandsText = null;
let scoreHundredsText = null;
let scoreTensText = null;
let scoreDigitText = null;
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

// sound
let bgmGame = null;

let sfxDeath = null;
let sfxFastMove = null;
let sfxKill = null;



/* --- functions ---  */
function createAvatar() {
  avatar = game.add.sprite(312, 250, 'avatar');
  game.physics.arcade.enable([avatar]);
  avatar.body.setSize(16, 18);
  avatar.body.collideWorldBounds = true;
  avatar.body.bounce.y = 0.1;
  avatar.body.gravity.y = 100;
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
  // add sprites
  game.add.sprite(0, 0, 'background');

  // --- ground
  ground = game.add.sprite(100, 330, 'ground');
  game.physics.arcade.enable(ground);
  ground.body.immovable = true;

  // --- walls
  walls = game.add.group();
  walls.enableBody = true;

  // roof
  let roof = walls.create(110, 20, 'roof');
  roof.scale.setTo(1.2, 1.0);
  roof.x = 70;
  roof.body.immovable = true;

  // wall, left
  let wall_l = walls.create(80, 50, 'wall');
  wall_l.body.immovable = true;

  // wall, right
  let wall_r = walls.create(532, 50, 'wall');
  wall_r.body.immovable = true;
}

function createText() {
  textStyle = {
    font: "65px Monospace",
    fill: "#ffffff"
  };

  scoreTenThousandsText = game.add.text(30, 30, "0", textStyle);
  scoreThousandsText = game.add.text(30, 90, "0", textStyle);
  scoreHundredsText = game.add.text(30, 150, "0", textStyle);
  scoreTensText = game.add.text(30, 210, "0", textStyle);
  scoreDigitText = game.add.text(30, 270, "0", textStyle);
}

function createUI() {
  // add score label
  createText();

  // add energy bar
  game.add.sprite(583, 48, 'bar-container');
  barEnergy = game.add.sprite(585, 50, 'bar-energy');

  // add keyboard controls image for player
  let keyboard = game.add.sprite(160, 367, 'keyboard');
  keyboard.scale.setTo(0.5, 0.5);
}

function wadOnDown() {
  if (wadCount == 0) {
    avatar.loadTexture('avatar-magnet');
    sfxFastMove.play();
  }

  wadCount = wadCount + 1;
}

function wadOnUp() {
  wadCount = wadCount - 1;

  if (wadCount == 0) {
    avatar.loadTexture('avatar');
  }
}



/* --- main ---  */
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

    // --- add physics ---
    game.physics.startSystem(Phaser.Physics.ARCADE);

    createStage();
    createAvatar();
    createUI();
    createControls();

    // create enemies
    enemyTimer = game.time.create(false);
    enemyTimer.loop(1000, spawnEnemy);
    enemyTimer.start();

    // add sounds
    sfxDeath = game.add.audio('death');
    sfxFastMove = game.add.audio('fast-move');
    sfxKill = game.add.audio('kill');

    bgmGame = game.add.audio('bgm');
    bgmGame.loop = true;
    bgmGame.play();
  }

  function handleInput() {
    let arrowKeysDown = cursors.left.isDown || cursors.right.isDown;
    let wadKeysDown = cursors.w.isDown || cursors.a.isDown || cursors.d.isDown

    // --- movement ---
    // left movement
    if (bootsOnGround && cursors.left.isDown) {
      avatar.body.velocity.x = -100;
    } 

    // right movement
    if (bootsOnGround && cursors.right.isDown) {
      avatar.body.velocity.x = 100;
    }

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

    // --- rest ---
    //no movement
    if (bootsOnGround && !arrowKeysDown && !wadKeysDown) {
      avatar.body.velocity.x = 0;
      energy = Math.min(1000, energy + 2.5)
    }
  }

  function preload () {
    // --- sprites ---
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

    // --- audio ---
    game.load.audio('bgm', 'res/bgm/172561__djgriffin__video-game-7.wav');
    game.load.audio('death', 'res/sfx/death.wav');
    game.load.audio('fast-move', 'res/sfx/fast-move.wav');
    game.load.audio('kill', 'res/sfx/kill.wav');
  }

  function render() {
    // --- for debugging purposes only ---
    //game.debug.body(avatar);

    // render score
    scoreTenThousandsText.setText( parseInt((score / 10000) % 10) );
    scoreThousandsText.setText( parseInt((score / 1000) % 10) );
    scoreHundredsText.setText( parseInt((score / 100) % 10) );
    scoreTensText.setText( parseInt((score / 10) % 10) );
    scoreDigitText.setText( parseInt(score % 10) );

    // render energy bar
    barEnergy.scale.setTo(1, energy / 1000.0);

    // render avatar
    if (energy == 0) {
      avatar.loadTexture('avatar');
    }
  }

  function restart() {
    restartTimer = game.time.create(false);

    restartTimer.add(5000, function() {
      score = 0;
      energy = 1000;
      game.state.restart();
    });

    restartTimer.start();
  }

  function spawnEnemy() {
    let enemy = game.add.sprite(game.rnd.between(111, 521), 
                                game.rnd.between( 51, 321), 
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
          sfxKill.play();
        } else {
          // player defeat!
          avatar.kill();
          bgmGame.stop();
          sfxDeath.play();

          restart();
        }
      }
    }

    handleInput();
  }
};
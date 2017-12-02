/* --- variables --- */
let avatar = null;
let slash = null;

let monster = null;

let map = null;


/* --- game  --- */
/*game = new Phaser.Game(672, 378, Phaser.AUTO, null, {*/
game = new Phaser.Game(378, 378, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update,
  render: render
});


/* --- classes --- */
class Avatar {
  constructor() {
    this.bootsOnGround = false;

    /* sprites */
    //this.sprite = game.add.sprite(21, 321, 'characters', 23);
    this.sprite = game.add.sprite(21, 321, 'master-sheet', 110);

    /* animations */
    this.sprite.animations.add('idle', [110]);
    this.sprite.animations.add('walk', [110,111]);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

    /* camera */
    game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
  }
}

class Monster {
  constructor() {
    this.bootsOnGround = false;

    /* sprite */
    this.sprite = game.add.sprite(201, 321, 'master-sheet', 171);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
  }

  update() {
    this.sprite.body.velocity.x = -5;

    if (this.bootsOnGround) {
      this.sprite.body.velocity.y = -50;
    }
  }
}

class Slash {
  constructor() {
    this.level = 0;

    /* sprite */
    this.sprite = game.add.sprite(-32, -32, 'slash', 0);

    /* animations */
    this.sprite.animations.add('attack', [0,1,2,3]);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.allowGravity = false;

    game.spaceKey.onDown.add(this.onSpace, this);
  }

  onSpace() {
    if (avatar) {
      if (this.level > 0) {
        game.sfxScream2.play();
      }

      this.sprite.x = avatar.sprite.x + (avatar.sprite.width / 2);
      this.sprite.y = avatar.sprite.y - (avatar.sprite.width / 2);

      if (this.level > 0) {
        this.sprite.body.velocity.x = 2000;
      }

      this.sprite.animations.play('attack', 30);

      this.sprite.animations.currentAnim.onComplete.add(function() {
        this.sprite.x = -32;
        this.sprite.y = -32;
        this.sprite.body.velocity.x = 0;
      }, this);
    }
  }
}

class Map {
  constructor(tag_tilemap, tag_tiles) {
    this.clear = false;

    /* tilemap */
    this.tilemap = game.add.tilemap(tag_tilemap);
    this.tilemap.addTilesetImage('ld40-tiles', 'ld40-tiles', 21, 21, 2 ,2);
    this.tilemap.addTilesetImage('ld40-tiles-background',
                                 'ld40-tiles-background', 21, 21);

    /* tile layers */
    this.layers = {
      'background': this.tilemap.createLayer('background'),
      'foreground': this.tilemap.createLayer('foreground')
    }

    this.layers.background.resizeWorld();

    /* object layers */
    this.parseObjectLayer();

    /* vfx */
    this.emitter = game.add.emitter(0,0,10);
    this.emitter.makeParticles('star');
    this.emitter.setXSpeed(-50, 50);
    this.emitter.setYSpeed(-50, -200);
    this.emitter.setRotation();
  }

  emitStars() {
    this.emitter.at(map.goal);
    this.emitter.explode(2000, 10);
  }

  parseObjectLayer() {
    this.goal = null;
    this.ground = [];

    /* parse each object layer */
    for (const layerKey in this.tilemap.objects) {
      let layer = this.tilemap.objects[layerKey];

      let self = this;
      layer.forEach(function(item, index) {
        /* generic object creation */
        let objectSprite = game.add.sprite(item.x, item.y);
        objectSprite.name = layerKey;
        objectSprite.width = item.width;
        objectSprite.height = item.height;

        /* ground objects */
        if (layerKey == 'goal') {
          game.physics.enable(objectSprite, Phaser.Physics.ARCADE);
          objectSprite.body.collideWorldBounds = true;
          objectSprite.body.allowGravity = false;
          self.goal = objectSprite;
        }

        if (layerKey == 'ground') {
          game.physics.enable(objectSprite, Phaser.Physics.ARCADE);
          objectSprite.body.collideWorldBounds = true;
          objectSprite.body.allowGravity = false;

          self.ground.push(objectSprite);
        }
      });
    }
  }
}


/* --- functions --- */
function handleInput() {
  let arrowKeysDown = game.cursorKeys.left.isDown ||
                      game.cursorKeys.right.isDown;

  if (avatar.bootsOnGround) {
    if (game.cursorKeys.left.isDown) {
      avatar.sprite.body.velocity.x = -50;
      avatar.sprite.animations.play('walk', 5);
    }

    if (game.cursorKeys.right.isDown) {
      avatar.sprite.body.velocity.x = 50;
      avatar.sprite.animations.play('walk', 5);
    }

    if (game.cursorKeys.up.isDown) {
      avatar.sprite.body.velocity.y = -50;
    }

    if (!arrowKeysDown) {
      avatar.sprite.body.velocity.x = 0;
      avatar.sprite.animations.play('idle');
    }
  }
}


/* --- life cycle functions --- */
function preload() {
  /* tilemaps */
  game.load.tilemap('ld40-test-map', 'res/map/ld40-test-map.json', null,
                    Phaser.Tilemap.TILED_JSON);

  /* tiles */
  game.load.image('ld40-tiles', 'res/img/tiles.png');
  game.load.image('ld40-tiles-background', 'res/img/tiles-background.png');

  /* sprite sheets */
  game.load.spritesheet('master-sheet', 'res/img/tiles.png', 21,21,900,2,2);
  game.load.spritesheet('slash', 'res/img/animation-slash.png', 32,32,4);

  /* particles */
  game.load.image('star', 'res/img/particle-star.png');

  /* audio */
  game.load.audio('bgm', 'res/bgm/bgm.mp3');
  game.load.audio('scream1', 'res/sfx/scream1.ogg');
  game.load.audio('scream2', 'res/sfx/scream2.wav');
  game.load.audio('win', 'res/sfx/win.wav');
}

function create() {
  /* cursors declaration */
  game.cursorKeys = game.input.keyboard.createCursorKeys();
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  /* physics declaration */
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 105;

  /* map */
  map = new Map('ld40-test-map');

  /* sprites */
  avatar = new Avatar();
  slash = new Slash();

  monster = new Monster();

  /* sfx */
  game.sfxScream1 = game.add.audio('scream1');
  game.sfxScream2 = game.add.audio('scream2');
  game.sfxWin = game.add.audio('win');

  /* bgm */
  bgmGame = game.add.audio('bgm');
  bgmGame.loop = true;
  bgmGame.play();
}

function update() {
  /* detect collisions with ground */
  map.ground.forEach(function(item, index) {
    avatar.bootsOnGround = game.physics.arcade.collide(avatar.sprite, item);
    monster.bootsOnGround = game.physics.arcade.collide(monster.sprite, item);
  });

  /* detect collision with monsters */
  game.physics.arcade.collide(avatar.sprite, monster.sprite);

  /* detect clear condition */
  let clear = game.physics.arcade.overlap(avatar.sprite, map.goal);
  if (clear && !map.clear) {
    game.sfxWin.play();
    map.emitStars();
    map.clear = true;
  }

  /* player update */
  handleInput();

  /* non-player update */
  monster.update();
}

function render() {
  //game.debug.body(avatar.sprite);
}

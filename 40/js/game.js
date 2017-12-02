/* --- variables --- */
let avatar = null;
let slash = null;

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

    /* sprite */
    this.sprite = game.add.sprite(21, 321, 'characters', 23);

    /* animations */
    this.sprite.animations.add('idle', [23]);
    this.sprite.animations.add('walk', [23,24,25,26]);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

    /* camera */
    game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
  }
}

class Slash {
  constructor() {
    this.sprite = game.add.sprite(-32, -32, 'slash', 0);

    /* animations */
    this.sprite.animations.add('attack', [0,1,2,3]);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.allowGravity = false;

    game.spaceKey.onDown.add(this.onSpace, this);
  }

  onSpace(test) {
    if (avatar) {
      this.sprite.x = avatar.sprite.x + (avatar.sprite.width / 2);
      this.sprite.y = avatar.sprite.y;
      this.sprite.body.velocity.x = 2000;
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

  /* character */
  game.load.spritesheet('characters', 'res/img/characters.png', 31,32,73,0,1);
  game.load.spritesheet('slash', 'res/img/animation-slash.png', 32,32,4);

  /* audio */
  game.load.audio('bgm', 'res/bgm/bgm.mp3');
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

  /* bgm */
  bgmGame = game.add.audio('bgm');
  bgmGame.loop = true;
  bgmGame.play();
}

function update() {
  /* detect collisions */
  map.ground.forEach(function(item, index) {
    avatar.bootsOnGround = game.physics.arcade.collide(avatar.sprite, item);
  });

  /* detect clear condition */
  let clear = game.physics.arcade.overlap(avatar.sprite, map.goal);

  handleInput();
}

function render() {
  
}

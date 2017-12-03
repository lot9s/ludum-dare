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
    this.kills = 0;

    /* sprite */
    this.sprite = game.add.sprite(map.pcSpawn.x, map.pcSpawn.y, 
                                  'master-sheet', 110);

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
  constructor(spawnX, spawnY) {
    this.bootsOnGround = false;

    /* sprite */
    this.sprite = game.add.sprite(spawnX, spawnY, 'master-sheet', 171);

    /* physics */
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
  }

  update() {
    let direction = (avatar.sprite.x - this.sprite.x) < 0 ? -1 : 1;
    this.sprite.body.velocity.x = 10 * direction;

    if (this.bootsOnGround) {
      this.sprite.body.velocity.y = -50;
    }
  }
}

class Slash {
  constructor() {
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
    /* play sfx */
    game.sfxSlash.play();

    if (avatar.kills > 0) { game.sfxScream1.play(); }
    if (avatar.kills > 1) { game.sfxScream2.play(); }

    /* move slash sprite in front of player character */
    this.sprite.x = avatar.sprite.x + (avatar.sprite.width / 2);
    this.sprite.y = avatar.sprite.y - (avatar.sprite.width / 2);

    /* apply velocity to sprite */
    if (avatar.kills > 1) {
      this.sprite.body.velocity.x = 2000;
    }

    /* play animation */
    this.sprite.animations.play('attack', 30);

    /* hide slash sprite at end of animation */
    this.sprite.animations.currentAnim.onComplete.add(function() {
      this.sprite.x = -32;
      this.sprite.y = -32;
      this.sprite.body.velocity.x = 0;
    }, this);
  }
}

class Map {
  constructor(tag_tilemap) {
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

  cleanUp() {
    this.clear = false;
    this.goal = null;
    this.pcSpawn = null;
    this.ground = [];
    this.monsters = [];

    this.layers['background'].destroy();
    this.layers['foreground'].destroy();
    this.layers = {};
  }

  emitStars() {
    this.emitter.at(map.goal);
    this.emitter.explode(2000, 10);
  }

  parseObjectLayer() {
    this.goal = null;

    this.pcSpawn = null;

    this.ground = [];
    this.monsters = [];

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

        /* goal object */
        if (layerKey == 'goal') {
          game.physics.enable(objectSprite, Phaser.Physics.ARCADE);
          objectSprite.body.collideWorldBounds = true;
          objectSprite.body.allowGravity = false;
          self.goal = objectSprite;
        }

        /* pc spawn point */
        if (layerKey == 'pc-spawn') {
          self.pcSpawn = objectSprite;
        }

        /* npc spawn points */
        if (layerKey == 'npc-spawn') {
          self.monsters.push(new Monster(item.x, item.y));
        }

        /* ground objects */
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
function handleCollisionsGoal() {
  let clear = game.physics.arcade.overlap(avatar.sprite, map.goal);

  /* start next level */
  if (clear && !map.clear) {
    /* sfx */
    game.sfxWin.play();

    /* vfx */
    map.emitStars();

    /* set flag */
    map.clear = true;

    startNextLevel();
  }
}

function handleCollisionsGround() {
  /* reset flags */
  avatar.bootsOnGround = false;
  map.monsters.forEach(function(monster, indexM) {
    monster.bootsOnGround = false;
  });

  /* do computation */
  map.ground.forEach(function(groundObj, indexG) {
    avatar.bootsOnGround = avatar.bootsOnGround ||
                           game.physics.arcade.collide(avatar.sprite,groundObj);

    /* monsters */
    map.monsters.forEach(function(monster, indexM) {
      monster.bootsOnGround = monster.bootsOnGround ||
                              game.physics.arcade.collide(monster.sprite,
                                                          groundObj);
    });
  });
}

function handleCollisionsMonsters() {
  map.monsters.forEach(function(monster, indexM) {
    game.physics.arcade.collide(avatar.sprite, monster.sprite);

    /* kill detection */
    let monsterKill = game.physics.arcade.overlap(slash.sprite, monster.sprite);
    if (monsterKill) {
      monster.sprite.kill();
      avatar.kills += 1;
    }
  });
}

function handleCollisionsWorld() {
  if (avatar.sprite.body.blocked.down) {
    // TODO: write death logic
    restartLevel();
  }
}

function handleInput() {
  let arrowKeysDown = game.cursorKeys.left.isDown ||
                      game.cursorKeys.right.isDown;

  if (avatar.bootsOnGround) {
    if (game.cursorKeys.left.isDown) {
      avatar.sprite.body.velocity.x = -50 + (-5 * avatar.kills);
      avatar.sprite.animations.play('walk', 5);
    }

    if (game.cursorKeys.right.isDown) {
      avatar.sprite.body.velocity.x = 50 + (5 * avatar.kills);
      avatar.sprite.animations.play('walk', 5);
    }

    if (game.cursorKeys.up.isDown) {
      avatar.sprite.body.velocity.y = -50 + (-5 * avatar.kills);
      game.sfxJump.play();
    }

    if (!arrowKeysDown) {
      avatar.sprite.body.velocity.x = 0;
      avatar.sprite.animations.play('idle');
    }
  }
}

function restartLevel() {
  let timer = game.time.create(false);

  /* delay the creation of the next level by 3 sec. */
  timer.add(3000, function() {
    map.cleanUp();

    if (game.level < game.levelProgression.length) {
      /* display new map */
      map = new Map(game.levelProgression[game.level]);

      /* re-position player character */
      avatar.sprite.bringToTop();
      avatar.sprite.x = map.pcSpawn.x;
      avatar.sprite.y = map.pcSpawn.y;
    
      /* re-position slash */
      slash.sprite.bringToTop();
    }
  });

  timer.start();
}

function startNextLevel() {
  let timer = game.time.create(false);

  /* delay the creation of the next level by 3 sec. */
  timer.add(3000, function() {
    map.cleanUp();
    game.level += 1;

    if (game.level < game.levelProgression.length) {
      /* display new map */
      map = new Map(game.levelProgression[game.level]);

      /* re-position player character */
      avatar.sprite.bringToTop();
      avatar.sprite.x = map.pcSpawn.x;
      avatar.sprite.y = map.pcSpawn.y;
    
      /* re-position slash */
      slash.sprite.bringToTop();
    }
  });

  timer.start();
}


/* --- life cycle functions --- */
function preload() {
  /* tilemaps */
  game.load.tilemap('ld40-test-map', 'res/map/ld40-test-map.json', null,
                    Phaser.Tilemap.TILED_JSON);
  game.load.tilemap('level1', 'res/map/level1.json', null,
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
  game.load.audio('jump', 'res/sfx/jump.mp3');
  game.load.audio('scream1', 'res/sfx/scream1.ogg');
  game.load.audio('scream2', 'res/sfx/scream2.wav');
  game.load.audio('slash', 'res/sfx/slash.wav');
  game.load.audio('win', 'res/sfx/win.wav');
}

function create() {
  game.level = 0;
  game.levelProgression = ['ld40-test-map', 'level1'];

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

  /* sfx */
  game.sfxJump = game.add.audio('jump');
  game.sfxScream1 = game.add.audio('scream1');
  game.sfxScream2 = game.add.audio('scream2');
  game.sfxSlash = game.add.audio('slash');
  game.sfxWin = game.add.audio('win');

  /* bgm */
  bgmGame = game.add.audio('bgm');
  bgmGame.loop = true;
  bgmGame.play();
}

function update() {
  handleCollisionsWorld();

  /* collisions */
  handleCollisionsGround();
  handleCollisionsMonsters();
  handleCollisionsGoal();

  /* player update */
  handleInput();

  /* non-player update */
  map.monsters.forEach(function(monster, indexM) {
    monster.update();
  });
}

function render() {
  //game.debug.body(avatar.sprite);
}

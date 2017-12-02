/* --- main --- */
window.onload = function() {
  /* --- variables --- */
  let avatar = null;
  let slash = null;
  let bootsOnGround = false;
  
  let mapObjects = null;


  /* --- game  --- */
  game = new Phaser.Game(672, 378, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update,
    render: render
  });


  /* --- functions --- */
  function preload() {
    /* map */
    game.load.tilemap('ld40-test-map', 'res/map/ld40-test-map.json', null,
                      Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'res/img/tiles.png');

    /* character */
    game.load.spritesheet('characters', 'res/img/characters.png', 32,32,73);
    game.load.spritesheet('slash', 'res/img/animation-slash.png', 32,32,4);
  }

  function create() {
    /* physics declaration */
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 105;

    /* map */
    let map = game.add.tilemap('ld40-test-map');
    map.addTilesetImage('ld40-tiles', 'tiles', 21, 21, 2, 2);
    
    let backLayer = map.createLayer('background');
    let foreLayer = map.createLayer('foreground');
    foreLayer.resizeWorld();

    mapObjects = createObjectLayerSprites(map);

    /* character */
    avatar = game.add.sprite(21, 321, 'characters', 23);
    avatar.animations.add('idle', [23]);
    avatar.animations.add('walk', [23,24,25,26]);

    slash = game.add.sprite(-32, -32, 'slash', 0);
    slash.animations.add('attack', [0,1,2,3]);

    /* physics application */
    game.physics.enable([avatar, slash], Phaser.Physics.ARCADE);
    avatar.body.collideWorldBounds = true;
    slash.body.allowGravity = false;

    game.physics.enable(mapObjects, Phaser.Physics.ARCADE);
    mapObjects.forEach(function(item, index) {
      item.body.collideWorldBounds = true;
    });

    /* cursors declaration */
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function(){
      slash.x = avatar.x + (avatar.width / 2);
      slash.y = avatar.y;
      slash.body.velocity.x = 2000;
      slash.animations.play('attack', 30);
      slash.animations.currentAnim.onComplete.add(function() {
        slash.x = -32;
        slash.y = -32;
        slash.body.velocity.x = 0;
      });
    });
  }
  
  function createObjectLayerSprites(map) {
    let mapObjects = [];

    /* parse each object layer */
    for (layerKey in map.objects) {
      let layer = map.objects[layerKey];

      /* parse each object in the object layer */
      layer.forEach(function(item, index) {
        let objectSprite = game.add.sprite(item.x, item.y);
        objectSprite.name = layerKey;
        objectSprite.width = item.width;
        objectSprite.height = item.height;
        mapObjects.push(objectSprite);
      });
    }

    return mapObjects;
  }
  
  function update() {
    /* detect collisions */
    mapObjects.forEach(function(item, index) {
      let collision = game.physics.arcade.collide(avatar, item);
      bootsOnGround = collision && item.name == "ground";
    });

    handleInput();
  }

  function handleInput() {
    let arrowKeysDown = cursors.left.isDown || cursors.right.isDown;

    if (bootsOnGround) {
      if (cursors.left.isDown) {
        avatar.body.velocity.x = -50;
        avatar.animations.play('walk', 5);
      }

      if (cursors.right.isDown) {
        avatar.body.velocity.x = 50;
        avatar.animations.play('walk', 5);
      }

      if (cursors.up.isDown) {
        avatar.body.velocity.y = -50;
      }

      if (!arrowKeysDown) {
        avatar.body.velocity.x = 0;
        avatar.animations.play('idle');
      }
    }
  }
  
  function render() {
    
  }
};

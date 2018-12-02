/* game state */
let state = {
    bgm: null,
    /* inputs */
    input: {
        key_w: null,
        key_s: null,
        key_a: null,
        key_d: null,
        key_up: null,
        key_down: null,
        key_left: null,
        key_right: null,
        key_space: null
    },
    /* sprites */
    avatar: null,
    altar: {
        sprite: null,
        sfx: null
    },
    offering: {
        img: null,
        alpha: 0
    },
    /* state */
    iteration: 0
};

// -----------------------------------------------------------------------------

/* scene | crafting */
let SceneCraft = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneCraft() {
        Phaser.Scene.call(this, { key: 'scene_craft' });
    },

    preload: function() {
        /* local deployment */
        this.load.setBaseURL('https://lot9s.github.io/ludum-dare/43/');

        /* audio */
        this.load.audio('craft', ['res/bgm/craft.wav']);

        /* images */
        this.load.image('rose', 'res/img/rose.png');
    },

    create: function() {
        /* create music */
        state.bgm = this.sound.add('craft', { loop: true });
        state.bgm.play();

        /* create offering */
        state.offering.img = this.add.image(320, 240, 'rose');
        state.offering.img.setScale(0.25).setAlpha(state.offering.alpha / 10);

        /* create text */
        this.add.text(20, 440, 'Press SPACE repeatedly to reveal offering.', {
            fontSize: '24px',
            fill: '#FFF'
        });

        /* create input */
        state.input.key_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    },

    update: function() {
        /* craft */
        if (Phaser.Input.Keyboard.JustDown(state.input.key_space)) {
            state.offering.alpha += 1;
            state.offering.img.setAlpha(state.offering.alpha / 10);

            /* finish crafting */
            if (state.offering.alpha >= 10) {
                state.bgm.stop();
                this.scene.start('scene_exploration');
            }
        }
    }
});

/* scene | exploration */
let SceneExploration = new Phaser.Class({
    Extends: Phaser.Scene,

    /* constants */
    WORDS: [
        'The truth hurts.',
        'Life is short.',
        'Change is inevitable.',
        'Knowledge is power.',
        'Truth cannot be destroyed.'
    ],

    FINAL_ITERATION: 5,

    /* flags */
    teleporting: false,

    /* text object for 'words of wisdom' */
    words: null,

    initialize: function SceneExploration() {
        Phaser.Scene.call(this, {key: 'scene_exploration'});
    },

    preload: function() {
        /* local deployment */
        this.load.setBaseURL('http://localhost/phaser/ludum-dare/43/');

        /* audio */
        this.load.audio('explore', ['res/bgm/explore.wav']);
        this.load.audio('words', ['res/bgm/words.wav']);

        /* images */
        this.load.image('altar', 'res/img/altar.png');

        /* spritesheet */
        this.load.spritesheet('avatar', 'res/img/characters-32x32.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    },

    create: function() {
        /* create music */
        state.bgm = this.sound.add('explore', { loop: true });
        state.bgm.play();

        state.altar.sfx = this.sound.add('words');

        /* create sprites */
        state.altar.sprite = this.physics.add.staticSprite(480, 240, 'altar');
        state.altar.sprite.setScale(1.5);
        state.altar.sprite.refreshBody(1.5);
        state.altar.sprite.setCollideWorldBounds(true);

        /* create avatars */
        state.avatar = this.physics.add.sprite(320, 240, 'avatar', 23);
        state.avatar.setSize(16,24);
        state.avatar.setOffset(8,8);
        state.avatar.setScale(1.5);
        state.avatar.setCollideWorldBounds(true);
        state.avatar.body.setAllowGravity(false);

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'avatar', frame: 23 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('avatar', { start: 23, end: 26 }),
            frameRate: 10,
            repeat: -1
        });

        /* create colliders */
        this.physics.add.collider(state.avatar, state.altar.sprite, this.onAltarCollide, null, this);

        /* create text */
        this.add.text(90, 440, 'Press WASD to navigate to shrine.', {
            fontSize: '24px',
            fill: '#FFF'
        });

        words = this.add.text(0, 0, this.WORDS[state.iteration], { fontSize: '16px', fill: '#FFF'});
        words.x = state.altar.sprite.x - (words.width / 2);
        words.y = state.altar.sprite.y - 113;
        words.setAlpha(0);

        /* create input */
        state.input.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        state.input.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        state.input.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        state.input.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        state.input.key_up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        state.input.key_down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        state.input.key_left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        state.input.key_right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    },

    update: function() {
        let keysDown = state.input.key_w.isDown || state.input.key_up.isDown    ||
                       state.input.key_s.isDown || state.input.key_down.isDown  ||
                       state.input.key_d.isDown || state.input.key_right.isDown ||
                       state.input.key_a.isDown || state.input.key_left.isDown;

        /* no movement */
        if (!keysDown || this.teleporting || state.iteration >= this.FINAL_ITERATION) {
            state.avatar.body.setVelocity(0);
            state.avatar.anims.play('idle');
            return;
        }

        /* move up */
        if (state.input.key_w.isDown || state.input.key_up.isDown) {
            state.avatar.body.setVelocity(0,-64);
            state.avatar.anims.play('right', true);
        }

        /* move down */
        if (state.input.key_s.isDown || state.input.key_down.isDown) {
            state.avatar.body.setVelocity(0,64);
            state.avatar.anims.play('right', true);
        }

        /* move right */
        if (state.input.key_d.isDown || state.input.key_right.isDown) {
            state.avatar.body.setVelocity(64,0);
            state.avatar.anims.play('right', true);
            state.avatar.resetFlip();
        }

        /* move left */
        if (state.input.key_a.isDown || state.input.key_left.isDown) {
            state.avatar.body.setVelocity(-64,0);
            state.avatar.anims.play('right', true);
            state.avatar.setFlip(true, false);

        }
    },

    onAltarCollide: function() {
        console.log('onAltarCollide');
        this.teleporting = true;

        state.altar.sfx.play();

        /* animate 'words of wisdom' */
        this.tweens.add({ targets: words, alpha: 1, duration: 2000, delay: 0 });

        state.iteration += 1;
        if (state.iteration < this.FINAL_ITERATION) {
            /* teleport altar */
            this.time.addEvent({
                delay: 3000,
                callback: function() {
                    if (state.iteration % 2 == 0) {
                        /* update altar */
                        state.altar.sprite.x = 480;
                        state.altar.sprite.y = Phaser.Math.Between(150,350);
                        state.altar.sprite.resetFlip();
                        state.altar.sprite.refreshBody();

                        /* update words */
                        words.setText(this.WORDS[state.iteration]);
                        words.x = state.altar.sprite.x - (words.width / 2);
                        words.y = state.altar.sprite.y - 113;
                        words.setAlpha(0);
                    } else {
                        /* update altar */
                        state.altar.sprite.x = 160;
                        state.altar.sprite.y = Phaser.Math.Between(150, 350);
                        state.altar.sprite.setFlip(true, false);
                        state.altar.sprite.refreshBody();

                        /* update words */
                        words.setText(this.WORDS[state.iteration]);
                        words.x = state.altar.sprite.x - (words.width / 2);
                        words.y = state.altar.sprite.y - 113;
                        words.setAlpha(0);
                    }

                    this.teleporting = false;
                },
                callbackScope: this
            });
        } else {
            state.bgm.stop();

            /* transition to epilogue */
            this.time.addEvent({
                delay: 5000,
                callback: function() { this.scene.start('scene_epilogue'); },
                callbackScope: this
            });
        }
    }
});

/* scene | epilogue */
let SceneEpilogue = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneEpilogue() {
        Phaser.Scene.call(this, {key: 'scene_epilogue'});
    },

    preload: function() {
        /* audio */
        this.load.audio('epilogue', ['res/bgm/epilogue.wav']);

        /* images */
        this.load.image('pillar', 'res/img/pillar.png');

        /* spritesheet */
        this.load.spritesheet('avatar', 'res/img/characters-32x32.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    },

    create: function() {
        /* create music */
        state.bgm = this.sound.add('epilogue', { loop: true });
        state.bgm.play();

        /* create avatar */
        state.avatar = this.physics.add.sprite(320, 240, 'avatar', 23);
        state.avatar.setSize(16,24);
        state.avatar.setOffset(8,8);
        state.avatar.setScale(1.5);
        state.avatar.setCollideWorldBounds(true);
        state.avatar.body.setAllowGravity(false);

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'avatar', frame: 23 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('avatar', { start: 23, end: 26 }),
            frameRate: 10,
            repeat: -1
        });

        /* create background */
        let pillars = this.physics.add.staticGroup();
        pillars.create(320, 160, 'pillar');
        pillars.create(200, 220, 'pillar');
        pillars.create(440, 220, 'pillar');
        pillars.create(240, 320, 'pillar');
        pillars.create(400, 320, 'pillar');

        pillars.children.iterate(function (child) {
            child.body.setSize(32,18);
            child.body.setOffset(16,84);
        });

        /* create colliders */
        this.physics.add.collider(state.avatar, pillars);

        /* create text */
        this.add.text(270, 20, 'THE END', {
            fontSize: '24px',
            fill: '#FFF'
        });

        /* create input */
        state.input.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        state.input.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        state.input.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        state.input.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        state.input.key_up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        state.input.key_down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        state.input.key_left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        state.input.key_right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    },

    update: function() {
        let keysDown = state.input.key_w.isDown || state.input.key_up.isDown    ||
                       state.input.key_s.isDown || state.input.key_down.isDown  ||
                       state.input.key_d.isDown || state.input.key_right.isDown ||
                       state.input.key_a.isDown || state.input.key_left.isDown;

        /* no movement */
        if (!keysDown) {
            state.avatar.body.setVelocity(0);
            state.avatar.anims.play('idle');
        }

        /* move up */
        if (state.input.key_w.isDown || state.input.key_up.isDown) {
            state.avatar.body.setVelocity(0,-64);
            state.avatar.anims.play('right', true);
        }

        /* move down */
        if (state.input.key_s.isDown || state.input.key_down.isDown) {
            state.avatar.body.setVelocity(0,64);
            state.avatar.anims.play('right', true);
        }

        /* move right */
        if (state.input.key_d.isDown || state.input.key_right.isDown) {
            state.avatar.body.setVelocity(64,0);
            state.avatar.anims.play('right', true);
            state.avatar.resetFlip();
        }

        /* move left */
        if (state.input.key_a.isDown || state.input.key_left.isDown) {
            state.avatar.body.setVelocity(-64,0);
            state.avatar.anims.play('right', true);
            state.avatar.setFlip(true, false);
        }
    } 
});

// -----------------------------------------------------------------------------

/* phaser 3 configuration */
let config = {
    version: '0.0.2',
    title: '',
    width: 640,
    height: 480,
    parent: 'game',
    scene: [ SceneCraft, SceneExploration, SceneEpilogue ],
    physics: {
        default: 'arcade',
        arcade: {
            /*debug: true,*/
            gravity: {
                y: 200
            }
        }
    },
    type: Phaser.AUTO, 
};

/* phaser 3 game */
let game = new Phaser.Game(config);

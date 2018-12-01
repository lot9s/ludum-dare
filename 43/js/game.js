/* game state */
let state = {
    bgm: null,
    input: {
        key_a: null,
        key_d: null,
        key_left: null,
        key_right: null,
        key_space: null
    },
    avatar: null,
    offering: {
        img: null,
        alpha: 0
    }
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
        this.load.setBaseURL('http://localhost/phaser/ludum-dare/43/');

        /* audio */
        //this.load.audio('intro', ['res/bgm/416624__jominvg__prelude-no-12.mp3']);
        this.load.audio('craft', ['res/bgm/346387__levelclearer__eternity20.wav']);
        //this.load.audio('credits', ['res/bgm/332489__neehnahw__calm-down.wav']);
        //this.load.audio('epilogue', ['res/bgm/209334__kvgarlic__guitardandcwithlongerfade.wav']);
        //this.load.audio('resolution', ['res/bgm/365187__furbyguy__chill-liquid-trap-loop.wav']);
        //this.load.audio('words', ['res/bgm/198416__divinux__ambientbell.wav']);

        /* images */
        this.load.image('rose', 'res/img/rose.png');
    },

    create: function() {
        /* create music */
        state.bgm = this.sound.add('craft', { loop: true });
        state.bgm.play();

        /* create input */
        state.input.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        state.input.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        state.input.key_left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        state.input.key_right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        state.input.key_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /* create offering */
        state.offering.img = this.add.image(320, 240, 'rose');
        state.offering.img.setScale(0.25).setAlpha(state.offering.alpha / 10);
    },

    render: function() {

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

    initialize: function SceneExploration() {
        Phaser.Scene.call(this, {key: 'scene_exploration'});
    },

    create: function() {
        /* create music */
        state.bgm = this.sound.add('explore5', { loop: true });
        state.bgm.play();

        /* create avatar */
        state.avatar.img = this.add.image(320, 240, 'avatar');
    },

    preload: function() {
        /* local deployment */
        this.load.setBaseURL('http://localhost/phaser/ludum-dare/43/');

        /* audio */
        //this.load.audio('explore1', ['res/bgm/380628__dragontrance__calm-loop.wav']);
        //this.load.audio('explore2', ['res/bgm/449398__goldguardtele__calm-exit-90bpm.mp3']);
        //this.load.audio('explore3', ['res/bgm/401245__rileywarren__getting-to-the-winery.wav']);
        //this.load.audio('explore4', ['res/bgm/416494__eardeer__eroika-remix.wav']);
        this.load.audio('explore5', ['res/bgm/441250__cummingtt__action4me-mixdown.wav']);

        /* images */
        this.load.image('avatar', 'res/img/avatar.png');
    },

    render: function() {

    },

    update: function() {
        if (state.input.key_d.isDown || state.input.key_right.isDown) {
            // TODO: move avatar to the right
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
    scene: [ SceneCraft, SceneExploration ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    type: Phaser.AUTO, 
};

/* phaser 3 game */
let game = new Phaser.Game(config);

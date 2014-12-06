var Preloader = require("./preloader");
var world = require("./world");



var cursors, jumpButton, jumpTimer = 0;

var create = function() {
    world.game.stage.backgroundColor = "#ffffff";
    world.game.physics.startSystem(Phaser.Physics.ARCADE);

    world.game.add.image(0, 0, 'background');

    world.map = world.game.add.tilemap('tilemap');
    world.map.addTilesetImage('tiles', 'tiles');
    world.layers.tiles = world.map.createLayer('ground');
    world.layers.tiles.resizeWorld();

    world.map.setCollisionBetween(1, 12);

    world.player = world.game.add.sprite(32, 320, 'player');
    world.game.physics.enable(world.player, Phaser.Physics.ARCADE);
    world.player.body.collideWorldBounds = true;
    world.player.body.gravity.y = 1000;
    world.player.body.maxVelocity.y = 500;
    world.player.body.setSize(16, 32);

    cursors = world.game.input.keyboard.createCursorKeys();
    jumpButton = world.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

var update = function() {
    world.game.physics.arcade.collide(world.player, world.layers.tiles);
    
    world.player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        world.player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        world.player.body.velocity.x = 150;
    }
    
    if (jumpButton.isDown && world.player.body.onFloor() && world.game.time.now > jumpTimer)
    {
        world.player.body.velocity.y = -500;
        jumpTimer = world.game.time.now + 750;
    }
};

var render = function() {
};



world.game = new Phaser.Game(800, 640, Phaser.CANVAS, 'game', {
    preload: Preloader.load,
    create: create,
    update: update,
    render: render
}, false, false);


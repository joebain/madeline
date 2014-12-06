var Preloader = require("./preloader");
var world = require("./world");

var Player = require("./player");


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

    world.player = new Player();
    world.game.world.add(world.player.sprite);

};

var update = function() {
    world.player.update();
};

var render = function() {
};



world.game = new Phaser.Game(800, 640, Phaser.CANVAS, 'game', {
    preload: Preloader.load,
    create: create,
    update: update,
    render: render
}, false, false);


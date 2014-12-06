var Preloader = require("./preloader");
var world = require("./world");

var Player = require("./player");
var Tree = require("./tree");


var cursors, jumpButton, jumpTimer = 0;

var create = function() {
    world.game.stage.backgroundColor = "#ffffff";
    world.game.physics.startSystem(Phaser.Physics.ARCADE);

    world.game.add.image(0, 0, 'background');

    // tilemap
    world.map = world.game.add.tilemap('tilemap');
    world.map.addTilesetImage('tiles', 'tiles');
    world.layers.tiles = world.map.createLayer('ground');
    world.layers.tiles.resizeWorld();

    world.map.setCollisionBetween(1, 12);

    // trees
    world.layers.trees = world.game.add.group(world.game.world, "trees");

    for (var o = 0 ; o < world.map.objects.trees.length ; o++) {
        var object = world.map.objects.trees[o];
        var tree = new Tree(object.x, object.y);
        world.trees.push(tree);
        world.layers.trees.add(tree.group);
        tree.age = 4;
    }

    // player
    world.player = new Player(world.map.objects.player[0].x, world.map.objects.player[0].y);
    world.game.world.add(world.player.sprite);


};

var update = function() {
    world.player.update();
    for (var t = 0 ; t < world.trees.length ; t++) {
        world.trees[t].update();
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


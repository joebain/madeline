var Preloader = require("./preloader");
var world = require("./world");

var Player = require("./player");
var Tree = require("./tree");
var Man = require("./man");
var OldWoman = require("./old-woman");

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

    world.map.setCollisionBetween(1, 2);

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
    world.game.world.add(world.player.getGameObject());

    // man
    this.manInterval = 10000;
    this.manTimer = world.game.time.now;// + this.manInterval;


};

var update = function() {
    world.player.update();
    for (var t = 0 ; t < world.trees.length ; t++) {
        world.trees[t].update();
    }
    for (var m = 0 ; m < world.men.length ; m++) {
        world.men[m].update();
        if (world.men[m].dead) {
            world.men.splice(m, 1);
            m--
        }
    }
    for (var d = 0 ; d < world.dependants.length ; d++) {
        world.dependants[d].update();
        if (world.dependants[d].dead) {
            var dependant = world.dependants[d];
            // find nearest tile for the bones

            var x = Math.round(dependant.sprite.x/32);
            var dx = 0;
            var y = Math.ceil(dependant.sprite.y/32)-1;
            while (x + dx < world.map.width && x - dx > 0) {
                if (world.map.hasTile(x-dx, y)) {
                    world.map.putTile(3, x-dx, y, "ground");
                    break;
                } else if (world.map.hasTile(x+dx, y)) {
                    world.map.putTile(3, x-dx, y, "ground");
                    break;
                }
                dx++;
            }
            world.dependants.splice(d, 1);
            d--
        }
    }


    // bring men on the scene
    if (this.manTimer < world.game.time.now && world.men.length === 0) {
        this.manTimer = world.game.time.now + this.manInterval;
        var manTypes = ["jump", "strength", "heart"];
        manTypes = _.without(manTypes, world.manType);
        world.manType = manTypes[Math.floor(Math.random()*manTypes.length)];
        var man = new Man(world.manType);
        world.game.world.add(man.sprite);
        world.men.push(man);
        var manPoints = _.without(world.map.objects.manPoints, world.manPoint);
        world.manPoint = manPoints[Math.floor(manPoints.length * Math.random())];
        world.manPoint = world.map.objects.manPoints[0];
        man.sendTo(world.manPoint.x, world.manPoint.y);
    }

    // deliver the baby
    if (world.player.pregnant && world.player.pregnancyMonths > 9) {
        var oldWoman = new OldWoman(world.player);
        world.game.world.add(oldWoman.sprite);
        world.dependants.push(oldWoman);
        world.player.rejuvinate(world.player.babyType);
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


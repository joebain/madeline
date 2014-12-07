var world = require("./world");

var Util = require("./util");

var Player = require("./player");
var Tree = require("./tree");
var Man = require("./man");
var OldWoman = require("./old-woman");

var Game = function(game) {
};

_.extend(Game.prototype, {
    create: function() {
        world.reset();

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
            tree.age = 3 + Math.random();
        }

        // player
        world.player = new Player(world.map.objects.player[0].x, world.map.objects.player[0].y);
        world.game.world.add(world.player.getGameObject());

        // man
        this.manInterval = 10000;
        this.manTimer = world.game.time.now;// + this.manInterval;
    },

    update: function() {
        // update various things that need updating
        world.player.update();
        if (world.player.isDead()) {
            world.player.getGameObject().destroy();
            world.game.state.start("game-over", false);
        }

        for (var t = 0 ; t < world.trees.length ; t++) {
            world.trees[t].update();
            if (world.trees[t].dead) {
                world.trees.splice(t, 1);
                t--
            }
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
            if (world.dependants[d].idDead && world.dependants[d].idDead()) {
                world.dependants.splice(d, 1);
                d--
            }
        }

        // process stomachs (turn people into bones)
        for (var s = 0 ; s < world.stomachs.length ; s++) {
            var stomach = world.stomachs[s];
            if (stomach.dead) {
                // find nearest tile for the bones
                var x = Math.round(stomach.body.sprite.x/32);
                var dx = 0;
                var y = Math.ceil(stomach.body.sprite.y/32)-1;
                while (x + dx < world.map.width && x - dx > 0) {
                    if (!world.map.hasTile(x-dx, y)) {
                        world.map.putTile(3, x-dx, y, "ground");
                        break;
                    } else if (!world.map.hasTile(x+dx, y)) {
                        world.map.putTile(3, x-dx, y, "ground");
                        break;
                    }
                    dx++;
                }
                world.stomachs.splice(s, 1);
                s--
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
    }
});

module.exports = Game;

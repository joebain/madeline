var world = require("./world");

var Util = require("./util");

var Player = require("./player");
var Tree = require("./tree");
var Man = require("./man");
var OldWoman = require("./old-woman");
var Giraffe = require("./giraffe");

var Game = function(game) {
};

_.extend(Game.prototype, {
    create: function() {
        world.reset();

        world.game.stage.backgroundColor = "#ffffff";
        world.game.physics.startSystem(Phaser.Physics.ARCADE);

        world.game.add.image(0, 0, 'background');

        // captions
        world.layers.captions = world.game.add.group(null, "captions");

        // tilemap
        world.map = world.game.add.tilemap('tilemap');
        world.map.addTilesetImage('tiles', 'tiles');
        world.layers.tiles = world.map.createLayer('ground');
        world.layers.tiles.resizeWorld();

        world.map.setCollisionBetween(1, 3);

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
        this.manTimer = world.game.time.now + this.manInterval;

        // giraffe
        this.maxGiraffeTime = 60000;
        this.minGiraffeTime = 10000;
        this.giraffeTimer = world.game.time.now + this.maxGiraffeTime;

        // captions is on top
        world.game.world.addChild(world.layers.captions);

    },

    updateCollection: function(collection, test) {
        for (var i = 0 ; i < collection.length ; i++) {
            collection[i].update();
            if ((test && test(collection[i])) || collection[i].dead) {
                collection.splice(i, 1);
                i--
            }
        }
    },

    update: function() {
        // update various things that need updating
        world.player.update();
        if (world.player.isDead()) {
            world.player.getGameObject().destroy();
            world.game.state.start("game-over", false);
        }

        this.updateCollection(world.trees);
        this.updateCollection(world.animals);
        this.updateCollection(world.men);
        this.updateCollection(world.dependants, function(d) { return d.isDead && d.isDead(); });

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
                        world.map.putTile(world.tiles.corpse, x-dx, y, "ground");
                        break;
                    } else if (!world.map.hasTile(x+dx, y)) {
                        world.map.putTile(world.tiles.corpse, x-dx, y, "ground");
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
//            world.manPoint = world.map.objects.manPoints[0];
            man.sendTo(world.manPoint.x, world.manPoint.y);
        }

        // make giraffes
        if (this.giraffeTimer < world.game.time.now && world.animals.length < 30) {
            // reset the timer
            this.giraffeTimer = this.maxGiraffeTime / world.trees.length;
            if (this.giraffeTimer < this.minGiraffeTime) {
                this.giraffeTime = this.minGiraffeTime;
            }
            this.giraffeTimer = world.game.time.now + this.giraffeTimer;

            // make the giraffe
            var entryPoint = world.map.objects.animalPoints[Math.floor(Math.random()*world.map.objects.animalPoints.length)];
//            var entryPoint = world.map.objects.animalPoints[3];
            var giraffe = new Giraffe();
            world.game.world.add(giraffe.sprite);
            world.animals.push(giraffe);
            giraffe.sendTo(entryPoint.x, entryPoint.y);
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

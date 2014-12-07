var world = require("./world");

var Util = require("./util");

var Tree = function(x,y) {
    this.group = new Phaser.Group(world.game, null);
    this.group.x = x;
    this.group.y = y;
    this.sprite = new Phaser.Sprite(world.game, 0, -64, 'tree');
    this.group.add(this.sprite);

    this.maxFruit = 3;

    this.ageRate = 1 / 3; // grow one step every minute

    this.reset();

    this.fruitSprites = [];
    var positions = [
        {x: 0, y: -48},
        {x: 12, y: -55},
        {x: 24, y: -43}
    ];
    for (var i = 0 ; i < this.maxFruit ; i++) {
        var fruitSprite = new Phaser.Sprite(world.game, positions[i].x, positions[i].y, 'fruit');
        this.group.add(fruitSprite);
        this.fruitSprites[i] = fruitSprite;
    }

    this.fullyGrownAge = 5;
    this.seedlingAge = 1;

    this.waterTimer = 0;
    this.thirstDuration = 10000; // 10 secs

    world.trees.push(this);
    world.layers.trees.add(this.group);
    var tPos = Util.worldToTilePos({x:x, y:y});
    var tile = world.map.putTile(world.tiles.tree, tPos.x, tPos.y, "ground");
    tile.tree = this;

};

_.extend(Tree.prototype, {
    reset: function() {
        this.fruit = 0;
        this.age = 0;
    },
    update: function() {

        if (this.dead) return;
        
        if (this.age < this.fullyGrownAge) {
            if (!this.thirsty) { // can't grow when thirsty
                var age = this.age + this.ageRate * world.game.time.physicsElapsed;

                // grown a stage
                if (Math.floor(age) != Math.floor(this.age)) {
                    if (this.age < this.seedlingAge && age >= this.seedlingAge) {
                        console.log("now its thirsty");
                        this.thirsty = true;
                        this.waterTimer = world.game.time.now + this.thirstDuration;
                    }
                }
                this.age = age;
                this.sprite.frame = Math.floor(this.age);
            }
        } else {
            // fully grown
            this.sprite.frame = 4;
            if (!this.grownFruit) {
                this.fruit = this.maxFruit;
                this.grownFruit = true;
            }
        }

        // check on thirst
        if (this.thirsty) {
            if (world.game.time.now > this.waterTimer) {
                this.kill();
            } else {
                var timeLeft = this.waterTimer - world.game.time.now;
                // flash if it needs watering
                if (timeLeft < this.thirstDuration*0.4 && timeLeft % 500 < 300) {
                    this.group.alpha = 0;
                } else {
                    this.group.alpha = 1;
                }
            }
        } else {
            this.group.alpha = 1;
        }

        if (this.fruit === 0 && this.grownFruit) {
            this.sprite.frame = 5;
        }

        for (var i = 0 ; i < this.maxFruit ; i++) {
            var fruitSprite = this.fruitSprites[i];
            if (i < this.fruit) {
                fruitSprite.visible = true;
            } else {
                fruitSprite.visible = false;
            }
        }
    },

    isDeadWood: function() {
        return this.sprite.frame === 5;;
    },

    kill: function() {
        this.group.destroy();
        this.dead = true;
        var tPos = Util.worldToTilePos(this.group);
        world.map.removeTile(tPos.x, tPos.y, "ground");
    }
});

module.exports = Tree;

var world = require("./world");

var OldWoman = function(player) {
    this.sprite = new Phaser.Sprite(world.game, player.getGameObject().x, player.getGameObject().y, 'old-woman');

    this.sprite.animations.add('walk', [0,1,2,3,4], 2, true);

    this.sprite.anchor.setTo(.5, 1);

    world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 1000;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.setSize(8, 32);

    this.age = player.age;
    this.health = 1;
    this.runSpeed = 4;
    this.foodClock = 1;//world.rates.feedRate;

    this.mind = "";
    this.mindTimer = 0;
    this.treeTimer = 0;
};

_.extend(OldWoman.prototype, {
    update: function() {
        if (this.dead) return;

        if (this.foodClock < 0) {
            this.health--;
            this.foodClock = world.rates.feedRate;
        }
        if (this.age > 100 || this.health <= 0) {
            this.dead = true;
            this.sprite.destroy();
        } else {
            world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

            this.sprite.body.velocity.x = 0;

            this.age += world.game.time.physicsElapsed * world.rates.ageRate;
            this.foodClock -= world.game.time.physicsElapsed;

            if (this.mind === "right")
            {
                this.sprite.body.velocity.x = -this.runSpeed;
                this.sprite.animations.play('walk');
                this.sprite.scale.x = -1;
            }
            else if (this.mind === "left")
            {
                this.sprite.body.velocity.x = this.runSpeed;
                this.sprite.animations.play('walk');
                this.sprite.scale.x = 1;
            }
            else if (this.mind === "stand") {
                this.sprite.animations.stop();
                this.frame = 0;
            }
            else if (this.mind === "eat") {
                if ((!this.treeInMind || this.treeInMind.fruit === 0) && this.treeTimer < world.game.time.now) {
                    this.treeTimer = world.game.time.now + 1000;
                    var maxFruit = 0;
                    var bestTree;
                    for (var t = 0 ; t < world.trees.length ; t++) {
                        var tree = world.trees[t];
                        if (tree.group.y !== this.sprite.y) {
                            continue;
                        } else {
                            if (tree.fruit > maxFruit) {
                                bestTree = tree;
                            }
                        }
                    }
                    this.treeInMind = bestTree;
                }
                if (this.treeInMind) {
                    var dir = (this.treeInMind.group.x - this.sprite.x) > 0 ? 1 : -1;
                    this.sprite.body.velocity.x = this.runSpeed * dir;
                    this.sprite.animations.play('walk');
                    this.sprite.scale.x = dir;
                } else {
                    this.sprite.animations.stop();
                    this.sprite.frame = 0;
                }
                if (this.treeInMind && this.sprite.overlap(this.treeInMind.sprite)) {
                    this.treeInMind.fruit--;
                    this.foodClock = world.rates.feedRate;
                    this.mind = "stand";
                }
            }

            if (this.mindTimer < world.game.time.now) {
                var options = _.without(["left", "right", "stand"], this.mind);
                this.mind = options[Math.floor(Math.random()*options.length)];
                this.mindTimer = world.game.time.now + (Math.random() * 5) * 1000 + 5000;
            }
            if (this.foodClock < 10) {
                this.mind = "eat";
            }
        }
    }
});

module.exports = OldWoman;

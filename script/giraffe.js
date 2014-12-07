var world = require("./world");

var util = require("./util");

var TreeMind = require("./tree-mind");

var Giraffe = function() {
    this.sprite = new Phaser.Sprite(world.game, 0, 0, "giraffe");
    this.sprite.animations.add('walk', [2,1], 4, true);
    this.sprite.animations.add('eat', [0,3], 4, true);
    this.sprite.anchor.setTo(.5, 1);

    this.atPosition = false;

    this.treeMind = new TreeMind(this, 1, 30);

    this.walkDuration = 2000;
    this.runSpeed = 20;

    this.shooed = "";
    this.shooTimer = 0;
    this.shooDuration = 5000;


    this.name = "giraffe";
};

_.extend(Giraffe.prototype, {
    update: function() {
        if (this.dead) return;

        if (this.atPosition) {
            this.treeMind.update();

            world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

            if (!this.sprite.inWorld) {
                this.kill();
                return;
            }

            this.sprite.body.velocity.x = 0;

            if (this.shooTimer > world.game.time.now) {
                this.treeMind.keepOnScreen = false;

                if (this.shooed === "right") {
                    this.sprite.body.velocity.x = this.runSpeed;
                    this.sprite.animations.play('walk');
                    this.sprite.scale.x = 1;
                } else if (this.shooed === "left") {
                    this.sprite.body.velocity.x = -this.runSpeed;
                    this.sprite.animations.play('walk');
                    this.sprite.scale.x = -1;
                }

            } else {
                this.shooed = "";
                this.treeMind.keepOnScreen = true;

                if (this.treeMind.go === "right")
                {
                    this.sprite.body.velocity.x = this.runSpeed;
                    this.sprite.animations.play('walk');
                    this.sprite.scale.x = 1;
                }
                else if (this.treeMind.go === "left")
                {
                    this.sprite.body.velocity.x = -this.runSpeed;
                    this.sprite.animations.play('walk');
                    this.sprite.scale.x = -1;
                }
                else if (this.treeMind.go === "eat") {
                    this.sprite.animations.play("eat");
                }
                else {
                    this.sprite.animations.stop();
                    this.sprite.frame = 0;
                }
            }
        }
    },

    initPhysics: function() {
        world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
//        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.gravity.y = 1000;
        this.sprite.body.maxVelocity.y = 500;
        this.sprite.body.setSize(12, 64);
    },

    sendTo: function(x,y) {
        this.sprite.y = y;
        if (x > world.game.width * 0.5) {
            this.sprite.x = world.game.width + 100;
        } else {
            this.sprite.x = -100;
        }
        this.offscreenPosition = {x: this.sprite.x};
        this.sprite.animations.play("walk");


        var tween = world.game.add.tween(this.sprite).to({x: x}, this.walkDuration);
        tween.onComplete.add((function() {
            this.initPhysics();
            this.sprite.animations.stop("walk");
            this.sprite.frame = 0;
            this.atPosition = true;
        }).bind(this));
        tween.start();
    },

    shoo: function(shooer) {
        this.shooTimer = world.game.time.now + this.shooDuration;
        if (shooer.x > this.sprite.x) {
            this.shooed = "left";
        } else {
            this.shooed = "right";
        }
    },

    kill: function() {
        this.sprite.destroy();
        this.dead = true;
    }
});

module.exports = Giraffe;

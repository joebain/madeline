var world = require("./world");

var Man = function(type) {
    this.sprite = new Phaser.Sprite(world.game, 0, 0, 'man');

    this.type = type;

    this.walkDuration = 2000;
    this.stayDuration = 10000;
    this.showOffInterval = 2000;

    this.leaveTimer = 0;
    this.showOffTimer = 0;

    this.sprite.anchor.setTo(.5, 1);

    this.sprite.animations.add('walk', [0,1], 8, true);

    this.sprite.animations.add('jump', [2,3], 4, false);
    this.sprite.animations.add('land', [3,2], 8, false);

    this.sprite.animations.add('lift', [4,5,6,5,4], 2, true);

    this.sprite.animations.add('heart', [7,8], 4, true);

    this.sprite.animations.add('sex', [9,10,11,9], 8, true);

};

_.extend(Man.prototype, {

    initPhysics: function() {
        world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.gravity.y = 1000;
        this.sprite.body.maxVelocity.y = 500;
        this.sprite.body.setSize(8, 32);
    },

    update: function() {
        if (this.dead) return;

        if (this.sprite.body) {
            world.game.physics.arcade.collide(this.sprite, world.layers.tiles);
        }

        if (this.havingSex) {
            this.sprite.animations.play("sex");
        }
        else if (this.atPosition) {
            if (this.leaveTimer < world.game.time.now) {
                 if (!this.leaving) {
                    this.leaving = true;
                    var tween = world.game.add.tween(this.sprite).to(this.offscreenPosition, this.walkDuration);
                    tween.onComplete.add((function() {
                        this.destroy();
                    }).bind(this));
                    this.sprite.animations.play("walk");
                    tween.start();
                }
            }
            else if (this.showOffTimer < world.game.time.now) {
                this.showOffTimer = world.game.time.now + this.showOffInterval;
                if (this.type === 'jump' && this.sprite.body.onFloor()) {
                    this.sprite.animations.play("jump");
                    setTimeout((function() {
                        this.sprite.frame = 0;
                        this.sprite.body.velocity.y = -300;
                    }).bind(this), 150);
                } else if (this.type === 'strength') {
                    this.sprite.animations.play("lift");
                } else if (this.type === 'heart') {
                    this.sprite.animations.play("heart");
                }
            }
        }
        if (this.sprite.animations.currentAnim === null) {
            this.sprite.frame = 0;
        }

    },

    destroy: function() {
        this.sprite.destroy();
        this.dead = true;
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
            this.leaveTimer = world.game.time.now + this.stayDuration;
        }).bind(this));
        tween.start();
    }
});

module.exports = Man;

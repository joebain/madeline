var world = require("./world");

var Player = function() {
    this.sprite = new Phaser.Sprite(world.game, 32, 320, 'player');

    this.runSpeed = 120; // pixels per second
    this.pxPerFrame = 4;
    // she moves at 2px per frame
    // so we need to play 25 frames to move her 150px
    // but this is way to fast, so we pretend it's 4 px per frame and
    // the legs just blur
    this.sprite.animations.add('run', [0,1,2,3,4,5,6], this.runSpeed / this.pxPerFrame, true);

    this.landingDuration = 100;
    this.crouchDuration = 200;
    this.sprite.animations.add('land', [8,9,8,0], 8, false);
    this.sprite.animations.add('crouch-down', [8,9], 4, false);
    this.sprite.animations.add('stand-up', [8,0], 4, false);

    world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 1000;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.setSize(8, 32);

    this.sprite.anchor.setTo(.5, 1); //so it flips around its middle

    this.cursors = world.game.input.keyboard.createCursorKeys();
    this.jumpTimer = 0;
};
_.extend(Player.prototype, {
    update: function() {
        world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

        this.sprite.body.velocity.x = 0;

        if (!this.crouching) {
            if (this.cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -this.runSpeed;
                this.sprite.animations.play('run');
                this.sprite.scale.x = -1;
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.body.velocity.x = this.runSpeed;
                this.sprite.animations.play('run');
                this.sprite.scale.x = 1;
            }
            else {
                this.sprite.animations.stop('run', true);
            }
        
            if (this.cursors.up.isDown && this.sprite.body.onFloor() && world.game.time.now > this.jumpTimer)
            {
                this.sprite.body.velocity.y = -500;
                this.jumpTimer = world.game.time.now + 1000;
            }
            else if (this.cursors.down.isDown && this.sprite.body.onFloor()) {
                this.crouching = true;
                this.sprite.animations.play("crouch-down");
            }

            if (!this.sprite.body.onFloor()) {
                this.sprite.animations.stop('run', true);
                this.sprite.frame = 7;
                this.onFloor = false;
            } else {
                if (!this.onFloor) {
                    this.crouching = true;
                    this.sprite.animations.play("land");
                    setTimeout((function() {
                        this.crouching = false;
                    }).bind(this), this.landingDuration);
                }
                this.onFloor = true;
            }
        } else {
            if (!this.cursors.down.isDown) {
                this.sprite.animations.play("stand-up");
                setTimeout((function() { this.crouching = false; }).bind(this), this.crouchDuration);
            }
        }
    }
});

module.exports = Player;

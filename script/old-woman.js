var world = require("./world");

var TreeMind = require("./tree-mind");

var OldWoman = function(player) {
    this.sprite = new Phaser.Sprite(world.game, player.getGameObject().x, player.getGameObject().y, 'old-woman');

    this.sprite.animations.add('walk', [0,1,2,3,4], 2, true);

    this.sprite.anchor.setTo(.5, 1);

    world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 1000;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.setSize(8, 32);

    this.treeMind = new TreeMind(this, player.age);

    this.runSpeed = 4;
};

_.extend(OldWoman.prototype, {
    update: function() {
        this.treeMind.update();

        world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

        this.sprite.body.velocity.x = 0;

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
        else {
            this.sprite.animations.stop();
            this.frame = 0;
        }
    },

    isDead: function() {
        return this.treeMind.stomach.dead;
    }
});

module.exports = OldWoman;

var world = require("./world");

var Tree = function(x,y) {
    this.group = new Phaser.Group(world.game, null);
    this.group.x = x;
    this.group.y = y;
    this.sprite = new Phaser.Sprite(world.game, 0, -64, 'tree');
    this.group.add(this.sprite);

    this.maxFruit = 3;

    this.ageRate = 1 / 60; // grow one step every minute

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

};

_.extend(Tree.prototype, {
    reset: function() {
        this.fruit = 0;
        this.age = 0;
    },
    update: function() {
        
        if (this.age < 4) {
            this.age += this.ageRate * world.game.time.physicsElapsed;

            if (this.age < 1) {
                this.sprite.frame = 0;
            } else if (this.age < 2) {
                this.sprite.frame = 1;
            } else if (this.age < 3) {
                this.sprite.frame = 2;
            }
        } else {
            // fully grown
            this.sprite.frame = 3;
            if (!this.grownFruit) {
                this.fruit = this.maxFruit;
                this.grownFruit = true;
            }
        }

        if (this.fruit === 0 && this.grownFruit) {
            this.sprite.frame = 4;
        }

        for (var i = 0 ; i < this.maxFruit ; i++) {
            var fruitSprite = this.fruitSprites[i];
            if (i < this.fruit) {
                fruitSprite.visible = true;
            } else {
                fruitSprite.visible = false;
            }
        }
    }
});

module.exports = Tree;

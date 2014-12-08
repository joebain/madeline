var world = require("./world");

var Stomach = function(body, health, age, foodRate) {
    this.body = body;

    this.health = health; // 1-3
    this.age = age;

    this.foodRate = foodRate || world.rates.feedRate;
    this.foodClock = this.foodRate;
    this.dead = false;
    this.imortal = false;

    world.stomachs.push(this);
};

_.extend(Stomach.prototype, {
    update: function() {
        if (this.dead) return;

        this.age += world.game.time.physicsElapsed * world.rates.ageRate;
        this.foodClock -= world.game.time.physicsElapsed;

        if (this.foodClock < 0) {
            if (!this.imortal) {
                this.health--;
                this.foodClock = this.foodRate;
            }
        }
        if (!this.imortal && (this.age > 100 || this.health <= 0)) {
            this.dead = true;
        }
    },

    eat: function(tree) {
        if (tree.fruit > 0) {
            world.sounds["high-munch"].play();
            tree.fruit--;
            this.foodClock = this.foodRate;
            return true;
        }
        return false;
    },


    getHungerPercent: function() {
        return this.foodClock/this.foodRate;
    }
});

module.exports = Stomach;

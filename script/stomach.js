var world = require("./world");

var Stomach = function(body, health, age) {
    this.body = body;

    this.health = health; // 1-3
    this.age = age;

    this.foodClock = world.rates.feedRate;
    this.dead = false;

    world.stomachs.push(this);
};

_.extend(Stomach.prototype, {
    update: function() {
        if (this.dead) return;

        this.age += world.game.time.physicsElapsed * world.rates.ageRate;
        this.foodClock -= world.game.time.physicsElapsed;

        if (this.foodClock < 0) {
            this.health--;
            this.foodClock = world.rates.feedRate;
        }
        if (this.age > 100 || this.health <= 0) {
            this.dead = true;
        }
    },

    eat: function(tree) {
        if (tree.fruit > 0) {
            tree.fruit--;
            this.foodClock = world.rates.feedRate;
            return true;
        }
        return false;
    },


    getHungerPercent: function() {
        return this.foodClock/world.rates.feedRate;
    }
});

module.exports = Stomach;

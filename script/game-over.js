var world = require("./world");

var GameOver = function(game) {
};

_.extend(GameOver.prototype, {
    create: function() {
        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.15, "Game Over", {fill: "#ffffff", font: world.fonts.title});
        text.anchor.setTo(0.5, 0.5);

        this.button = world.game.add.button(world.game.width * 0.5, world.game.height * 0.5, "retry-button", function() {
            world.game.state.start("game");
        });
        this.button.setFrames(1,0);
        this.button.frame = 0;
        this.button.anchor.setTo(0.5, 0.6);

        this.continueButton = world.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    },

    update: function() {
        if (this.continueButton.isDown) {
            this.button.frame = 1;
            setTimeout(function() {
                world.game.state.start("game");
            }, 500);
        }
    }
});

module.exports = GameOver;


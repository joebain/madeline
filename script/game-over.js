var world = require("./world");

var GameOver = function(game) {
};

_.extend(GameOver.prototype, {
    create: function() {
        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.2, "Game Over", {fill: "#ffffff", font: "100px PixelDart"});
        text.anchor.setTo(0.5, 0.5);

        var button = world.game.add.button(world.game.width * 0.5, world.game.height * 0.5, "retry-button", function() {
            world.game.state.start("game");
        });
        button.setFrames(1,0);
        button.frame = 0;
        button.anchor.setTo(0.5, 0.6);
    }
});

module.exports = GameOver;


var world = require("./world");

var Menu = function(game) {
};

_.extend(Menu.prototype, {
    create: function() {
        world.game.add.image(0, 0, 'background');

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.2, "Matriline", {fill: "#ffffff", font: "100px PixelDart"});
        text.anchor.setTo(0.5, 0.5);

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.3, "", {fill: "#ffffff", font: "36px PixelDart"});
        text.text = "Welcome to the world.\n\nYou must eat, shit and give birth, if you want to survive.\n\nPress 'z' to eat fruit off trees or take a shit.\n\nPress 'x' to have sex or give birth (when the baby is ready).";
        text.align = "center";
        text.wordWrap = true;
        text.wordWrapWidth = world.game.width - 100;
        text.anchor.setTo(0.5, 0);

        var button = world.game.add.button(world.game.width * 0.5, world.game.height * 0.8, "play-button", function() {
            world.game.state.start("game");
        });
        button.setFrames(1,0);
        button.frame = 0;
        button.anchor.setTo(0.5, 0.5);
    }
});

module.exports = Menu;

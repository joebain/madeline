var world = require("./world");

var Menu = function(game) {
};

_.extend(Menu.prototype, {
    create: function() {
        world.game.add.image(0, 0, 'background');

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.15, "Matriline", {fill: "#ffffff", font: world.fonts.title});
        text.anchor.setTo(0.5, 0.5);

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.3, "", {fill: "#ffffff", font: world.fonts.body});
        text.text = "Welcome to the world.\n\nYou must eat, shit and give birth, if you want to survive.\n\nPress 'z' to eat fruit off trees or take a shit.\n\nPress 'x' to have sex or give birth (when the baby is ready).\n\nPress 'z' to play, or click the button.";
        text.align = "center";
        text.wordWrap = true;
        text.wordWrapWidth = world.game.width - 100;
        text.anchor.setTo(0.5, 0);

        this.button = world.game.add.button(world.game.width * 0.5, world.game.height * 0.8, "play-button", function() {
            world.game.state.start("game");
        });
        this.button.setFrames(1,0);
        this.button.frame = 0;
        this.button.anchor.setTo(0.5, 0.5);


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

module.exports = Menu;

var world = require("./world");

var Menu = function(game) {
};

_.extend(Menu.prototype, {
    create: function() {
        world.game.add.image(0, 0, 'background');

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.15, "Matriline", {fill: "#ffffff", font: world.fonts.title});
        text.anchor.setTo(0.5, 0.5);

        var text = world.game.add.text(world.game.width * 0.5, world.game.height * 0.3, "", {fill: "#ffffff", font: world.fonts.body});
        text.text = [
            "You're all alone. Shipwrecked (or something) in this tiny little screen.",
            "If you want to survive you will need to work.",
            "Watch out for the local wildlife, and see if you can get any favours from the native inhabitants.",
            "",
            "Eat, shit, and have babies"
        ].join("\n\n");
        text.align = "center";
        text.wordWrap = true;
        text.wordWrapWidth = world.game.width - 100;
        text.anchor.setTo(0.5, 0);
        text.setShadow(0, 2, "#444444", 1);

        this.button = world.game.add.button(world.game.width * 0.5, world.game.height * 0.85, "play-button", function() {
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

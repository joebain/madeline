var world = require("./world");

var Preloader = {
    load: function() {
        world.game.load.spritesheet('player', 'img/player.png', 32, 32);
        world.game.load.image('background', 'img/background.png');
        world.game.load.tilemap('tilemap', 'maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        world.game.load.image('tiles', 'img/tilemap.png');
    }
};

module.exports = Preloader;

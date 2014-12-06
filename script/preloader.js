var world = require("./world");

var Preloader = {
    load: function() {
        world.game.load.spritesheet('player', 'img/player.png', 32, 32);
        world.game.load.spritesheet('belly', 'img/belly.png', 32, 32);
        world.game.load.image('background', 'img/background.png');
        world.game.load.tilemap('tilemap', 'maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        world.game.load.image('tiles', 'img/tilemap.png');
        world.game.load.image('heart', 'img/heart.png');
        world.game.load.spritesheet('tree', 'img/tree.png', 32, 64);
        world.game.load.image('fruit', 'img/fruit.png');
        world.game.load.spritesheet('man', 'img/man.png', 32, 48);
        world.game.load.spritesheet('old-woman', 'img/old-woman.png', 32, 32);
    }
};

module.exports = Preloader;

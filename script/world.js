var World = {
    map: null,
    layers: {
        tiles: null
    },
    player: null,
    game: null
};

World.reset = function() {
    World.map = null;
    World.layers.tiles = null;
    World.player = null;
    World.game = null;
};

module.exports = World;

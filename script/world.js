var World = {
    map: null,
    layers: {
        tiles: null,
        trees: null,
    },
    player: null,
    game: null,
    trees: [],
    men: []
};

World.reset = function() {
    World.map = null;
    World.layers.tiles = null;
    World.layers.trees = null;
    World.player = null;
    World.game = null;
    World.trees = [];
    World.men = [];
};

module.exports = World;

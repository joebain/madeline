var World = {
    map: null,
    layers: {
        tiles: null,
        trees: null,
    },
    player: null,
    game: null,
    trees: [],
    men: [],
    dependants: [],
    rates: {
        ageRate: 15 / (30), // 30 secs is 15 years
        feedRate: 60, // got to eat once a minute
        pregnancyRate: 1 / 4 // 7 seconds is one month (63 secs for full pregnancy)
    }
};

World.reset = function() {
    World.map = null;
    World.layers.tiles = null;
    World.layers.trees = null;
    World.player = null;
    World.game = null;
    World.trees = [];
    World.men = [];
    World.dependants = [];
};

module.exports = World;

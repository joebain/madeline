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
    stomachs: [],
    rates: {
        ageRate: 15 / (30), // 30 secs is 15 years
        feedRate: 20, // got to eat once a minute
        pregnancyRate: 1 / 4 // 7 seconds is one month (63 secs for full pregnancy)
    },
    fonts: {
        body: "42px monaco",
        title: "120px PixelDart",
        hud: "42px monaco",
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
    World.stomachs = [];
};

module.exports = World;

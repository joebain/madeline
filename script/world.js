var World = {
    map: null,
    layers: {
        tiles: null,
        trees: null,
        captions: null
    },
    player: null,
    game: null,
    trees: [],
    men: [],
    dependants: [],
    stomachs: [],
    animals: [],
    rates: {
        ageRate: 15 / (30), // 30 secs is 15 years
        feedRate: 60, // got to eat once a minute
        pregnancyRate: 1 / 4 // 7 seconds is one month (63 secs for full pregnancy)
    },
    fonts: {
        body: "42px monaco",
        title: "100px PixelDart",
        hud: "42px monaco",
        caption: "34px monaco"
    },
    tiles: {
        ground: 1,
        corpse: 7,
        tombstone: 8,
        water: 6,
        tree: 4,
        fence: 3
    },
    sounds: {}
};

World.reset = function() {
    World.map = null;
    World.layers.tiles = null;
    World.layers.trees = null;
    World.layers.captions = null;
    World.player = null;
    World.trees = [];
    World.men = [];
    World.dependants = [];
    World.stomachs = [];
    World.animals = [];
};

module.exports = World;

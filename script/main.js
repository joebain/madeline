var world = require("./world");

var Preloader = require("./preloader");
var Menu = require("./menu");
var Game = require("./game");
var GameOver = require("./game-over");

world.game = new Phaser.Game(800, 640, Phaser.CANVAS, 'game');
world.game.antialias = false;

world.game.state.add("preloader", Preloader);
world.game.state.add("menu", Menu);
world.game.state.add("game", Game);
world.game.state.add("game-over", GameOver);
world.game.state.start("preloader");

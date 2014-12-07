var world = require("./world");

var Util = require("./util");

var Stomach = require("./stomach");

var TreeMind = function(body, age, foodTimer) {
    this.stomach = new Stomach(body, 1, age, foodTimer);
    this.stomach.imortal = true;

    this.body = body;

    this.go = "";

    this.mind = "";
    this.mindTimer = 0;
    this.treeTimer = 0;
    this.eatingTimer = 0;
    this.keepOnScreen = true;
};

_.extend(TreeMind.prototype, {
    update: function() {
        this.stomach.update();

        if (!this.stomach.dead) {

            if (this.eatingTimer > world.game.time.now) {
                return;
            }

            if (this.keepOnScreen) {

                var tPos = Util.worldToTilePos(this.body.sprite);
                var rightDownTile = world.map.getTile(tPos.x+1, tPos.y+1); 
                var leftDownTile = world.map.getTile(tPos.x-1, tPos.y+1); 
                // at a platform edge
                if (this.mind === "right" && (!rightDownTile || rightDownTile.index !== world.tiles.ground)) {
                    console.log("prefer to stand than go right");
                    this.mind = "stand";
                } else if (this.mind === "left" && (!leftDownTile || leftDownTile.index !== world.tiles.ground)) {
                    this.mind = "stand";
                    console.log("prefer to stand than go left");
                }
                // at the screen edge
                else if (this.body.sprite.x < 32) {
                    this.mind = "right";
                } else if (this.body.sprite.x > world.game.width-this.body.sprite.width-32) {
                    this.mind = "left";
                }
            }

            if (this.mind === "right")
            {
                this.go = "right";
            }
            else if (this.mind === "left")
            {
                this.go = "left";
            }
            else if (this.mind === "stand") {
                this.go = "";
            }
            else if (this.mind === "eat") {
                if ((!this.treeInMind || this.treeInMind.fruit === 0) && this.treeTimer < world.game.time.now) {
                    this.treeTimer = world.game.time.now + 1000;
                    var maxFruit = 0;
                    var bestTree;
                    for (var t = 0 ; t < world.trees.length ; t++) {
                        var tree = world.trees[t];
                        if (tree.group.y !== this.body.sprite.y) {
                            continue;
                        } else {
                            if (tree.fruit > maxFruit) {
                                bestTree = tree;
                            }
                        }
                    }
                    this.treeInMind = bestTree;
                }
                if (this.treeInMind) {
                    var dir = this.treeInMind.group.x - this.body.sprite.x;
                    if (dir > 0) {
                        this.go = "right";
                    } else {
                        this.go = "left";
                    }
                } else {
                    this.go = "";
                }
                if (this.treeInMind && this.body.sprite.overlap(this.treeInMind.sprite)) {
                    if (this.stomach.eat(this.treeInMind)) {
                        this.go = "eat";
                        this.eatingTimer = world.game.time.now + 3000;
                        this.mind = "stand";
                    }
                }
            }

            if (this.mindTimer < world.game.time.now) {
                var options = ["left", "right", "stand"];
                this.mind = options[Math.floor(Math.random()*options.length)];
                this.mindTimer = world.game.time.now + (Math.random() * 5) * 1000 + 5000;
            }
            if (this.stomach.foodClock < 10) {
                this.mind = "eat";
            }
        }
    }
});

module.exports = TreeMind;

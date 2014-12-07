var world = require("./world");
var Util = require("./util");

var Stomach = require("./stomach");
var Tree = require("./tree");

var Player = function(x, y) {
    this.sprite = new Phaser.Sprite(world.game, x, y, 'player');

    this.runSpeed = 120; // pixels per second
    this.pxPerFrame = 4;
    // she moves at 2px per frame
    // so we need to play 25 frames to move her 150px
    // but this is way to fast, so we pretend it's 4 px per frame and
    // the legs just blur
    this.sprite.animations.add('run', [0,1,2,3,4,5,6], this.runSpeed / this.pxPerFrame, true);

    this.landingDuration = 100;
    this.crouchDuration = 200;
    this.sexDuration = 5000;
    this.sprite.animations.add('land', [8,9,8,0], 8, false);
    this.sprite.animations.add('crouch-down', [8,9], 4, false);
    this.sprite.animations.add('stand-up', [8,0], 4, false);
    this.sprite.animations.add('sex', [10,11,12,11], 8, true);

    this.sprite.animations.add('wave', [17,18], 4, true);

    this.sprite.animations.add('baby-run', [13,14,15,16], 8, true);

    this.bellySprite = new Phaser.Sprite(world.game, -16, -32, 'belly');
    this.bellySprite.frame = 0;

    this.carrySprite = new Phaser.Sprite(world.game, -16, -64, 'carry');
    this.carrySpriteFrames = {"water": 1, "wood": 2, "bones": 3};
    this.carrySprite.frame = 0;
    
    this.sprite.addChild(this.bellySprite);
    this.sprite.addChild(this.carrySprite);
    this.sprite.anchor.setTo(.5, 1); //so it flips around its middle

    world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 1000;
    this.sprite.body.maxVelocity.y = 1500;
    this.sprite.body.setSize(8, 32);


    this.cursors = world.game.input.keyboard.createCursorKeys();
    this.actionButton1 = world.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.actionButton2 = world.game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.actionButton1Timer = 0;
    this.actionButton2Timer = 0;
    this.upKeyTimer = 0;

    // speeds &c
    this.jumpSpeed = 400;
    this.jumpDuration = 100;
    this.jumpDurationIncrements = 100;
    this.jumpTimer = 0;

    this.shooTimer = 0;

    // status variables
    this.jumpStrength = 1; // up to 3
    this.carryStrength = 1; // up to 3
    this.heartStrength = 1; // up to 3

    this.generations = 0;

    this.rejuvinate();

    // hud
    this.hud = world.game.add.group();
    this.ageText = new Phaser.Text(world.game, 10, 10, "", {font: world.fonts.hud, fill: "#ffffff"});
    this.hud.add(this.ageText);
    this.heartBar = new Phaser.TileSprite(world.game, 10, 40, 0, 16, "heart");
    this.hud.add(this.heartBar);
    this.strengthBar = new Phaser.TileSprite(world.game, 80, 40, 0, 16, "arm");
    this.hud.add(this.strengthBar);
    this.hungerBar = world.game.add.graphics(10, 65);
    this.hungerBarMaxWidth = 140;
    this.hungerBarHeight = 15;
    this.generationsText = new Phaser.Text(world.game, 0, 10, "", {font: world.fonts.hud, fill: "#ffffff"});
    this.hud.add(this.generationsText);


    // testing
//    this.pregnant = true;
//    this.pregnancyMonths = 8;
//    this.carrying = "water";
//    this.stomach.age = 17;
    this.carryStrength = 3;
};
_.extend(Player.prototype, {
    getGameObject: function() {
        return this.sprite;
    },

    rejuvinate: function(type) {
        if (type === "strength") {
            if (this.carryStrength < 3) {
                this.carryStrength++;
            }
        } else if (type === "jump") {
            if (this.jumpStrength < 3) {
                this.jumpStrength++;
            }
        } else if (type === "heart") {
            if (this.heartStrength < 3) {
                this.heartStrength++;
            }
        }

        this.stomach = new Stomach(this, this.heartStrength, 0);

        this.pregnancyMonths = 0;
        this.pregnant = false;

        this.carrying = "";
        this.needsAPoo = false;
        this.crouching = false;

        this.generations ++;
    },

    isAdult: function() {
        return this.stomach.age >= 16;
    },

    update: function() {
        if (this.stomach.dead) return;


        world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

        this.sprite.body.velocity.x = 0;
        if (this.sprite.body.velocity.y < 0) {
            this.sprite.body.velocity.y *= 0.9;
        }

        var tile = this.getTile();
        if (tile && tile.index === world.tiles.water && !this.jumping) {
            var tPos = this.getTilePos();
            this.sprite.y = Math.sin(world.game.time.now / (40*Math.PI))*8+tPos.y*32+16;
            this.sprite.body.velocity.y = 0;
            this.inWater = true;
        } else {
            this.inWater = false;
        }

        var howPregnant = Math.ceil(Math.min(this.pregnancyMonths, 9)/3);
        this.bellySprite.frame = howPregnant;

        var nearbyAnimals = this.nearbyAnimals();
        var nearbyTree = this.nearbyTree();

        if (this.shooTimer > world.game.time.now) {
            return;
        }

        if (this.havingSex) {
        } else if (!this.crouching) {
            if (this.cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -this.runSpeed;
                if (!this.isAdult()) {
                    this.sprite.animations.play('baby-run');
                } else {
                    this.sprite.animations.play('run');
                }
                this.sprite.scale.x = -1;
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.body.velocity.x = this.runSpeed;
                if (!this.isAdult()) {
                    this.sprite.animations.play('baby-run');
                } else {
                    this.sprite.animations.play('run');
                }
                this.sprite.scale.x = 1;
            }
            else {
                this.sprite.animations.stop();
                if (!this.isAdult()) {
                    this.sprite.animations.frame = 13;
                } else {
                    this.sprite.animations.frame = 0;
                }
            }

            if (this.actionButton1.isDown && world.game.time.now > this.actionButton1Timer) {
                if (this.isAdult()) {
                    // build a grave
                    if (this.carrying === "wood" && this.nearbyCorpse()) {
                        var corpse = this.nearbyCorpse();
                        world.map.putTile(world.tiles.tombstone, corpse.x, corpse.y, "ground");
                        this.carrying = "";
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                    // build fences
                    else if (this.carrying === "wood" && this.nearbyEmptySpace()) {
                        var space = this.nearbyEmptySpace();
                        world.map.putTile(world.tiles.fence, space.x, space.y, "ground");
                        this.sprite.y -= 32;
                        this.carrying = "";
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                    // shoo animals
                    else if (this.carrying === "" && nearbyAnimals.length && _.any(nearbyAnimals, function(a) {return a.name === "giraffe";})) {
                        for (var a = 0 ; a < nearbyAnimals.length ; a++) {
                            var animal = nearbyAnimals[a];
                            if (animal.name === "giraffe") {
                                animal.shoo(this.sprite);
                            }
                        }
                        this.sprite.animations.play("wave");
                        this.actionButton1Timer = world.game.time.now + 1000;
                        this.shooTimer = world.game.time.now + 1000;
                    }
                    // water a tree
                    else if (nearbyTree && nearbyTree.thirsty && this.carrying === "water") {
                        nearbyTree.thirsty = false;
                        this.carrying = "";
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                    // pick up wood
                    else if (nearbyTree && nearbyTree.isDeadWood() && this.carrying === "" && this.carryStrength >= 3) {
                        nearbyTree.kill();
                        this.carrying = "wood";
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                    // drop water
                    else if (this.carrying === "water" && this.nearbyEmptySpace()) {
                        this.carrying = "";
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                } else {
                    // only babies can shit without crouching
                    if (this.needsAPoo && this.nearbyEmptySpace()) {
                        var space = this.nearbyEmptySpace();
                        var tree = new Tree(space.x*32, (space.y+1)*32);
                        this.needsAPoo = false;
                        this.actionButton1Timer = world.game.time.now + 1000;
                    }
                }
                // eat fruit
                if (this.actionButton1Timer < world.game.time.now && nearbyTree && nearbyTree.fruit > 0 && this.stomach.eat(nearbyTree)) {
                    this.needsAPoo = true;
                    this.actionButton1Timer = world.game.time.now + 1000;
                }
            }


            // jumping
            if (this.canJump && this.cursors.up.isDown && (this.sprite.body.onFloor() || this.inWater)) {
                this.jumping = true;
                this.jumpTimer = world.game.time.now + (this.jumpDuration+this.jumpStrength*this.jumpDurationIncrements) * (1-howPregnant/4)
            }
            if (this.jumping) {
                this.sprite.body.velocity.y = -this.jumpSpeed;
                if (!this.cursors.up.isDown || world.game.time.now > this.jumpTimer) {
                    this.jumping = false;
                }
            }

            // having sex
            if (this.actionButton2.isDown && this.sprite.body.onFloor()) {
                
                // check if we are with a man
                var withMan = undefined;
                for (var m = 0 ; m < world.men.length ; m++) {
                    if (this.sprite.overlap(world.men[m].sprite)) {
                        withMan = world.men[m];
                        break;
                    }
                }
                if (withMan) {
                    if (this.pregnant) {
                        // some text about how you can't have sex
                    } else if (!this.isAdult()) {
                        // some text about how you can't have sex
                    } else {
                        this.havingSex = true;
                        withMan.havingSex = true;
                        this.sprite.animations.play("sex");
                        setTimeout((function() {
                            this.havingSex = false;
                            withMan.havingSex = false;
                            this.pregnant = true;
                            this.babyType = withMan.type;
                        }).bind(this), this.sexDuration);
                    }
                }
            }

            // crouching
            if (this.cursors.down.isDown && this.isAdult()) {
                this.crouching = true;
                this.sprite.animations.play("crouch-down");
            }

            if (this.sprite.body.onFloor() || this.inWater) {
                if (!this.onFloor) {
                    if (this.isAdult()) {
                        this.crouching = true;
                        this.sprite.animations.play("land");
                        setTimeout((function() {
                            this.crouching = false;
                        }).bind(this), this.landingDuration);
                    }
                }
                this.onFloor = true;
                if (!this.cursors.up.isDown) {
                    this.canJump = true;
                }
            } else {
                this.sprite.animations.stop('run', true);
                if (!this.isAdult()) {
                    this.sprite.frame = 14;
                } else {
                    this.sprite.frame = 7;
                }
                this.onFloor = false;
                this.canJump = false;
            }
        } else {
            // stand up
            if (!this.cursors.down.isDown) {
                if (this.isAdult()) {
                    this.sprite.animations.play("stand-up");
                    setTimeout((function() { this.crouching = false; }).bind(this), this.crouchDuration);
                }
            } else {
                // collecting water
                if (this.isAdult() && this.actionButton1.isDown && !this.carrying && this.nearbyWater()) {
                    this.carrying = "water";
                    this.actionButton1Timer = world.game.time.now + 1000;
                }
                // shitting
                else if (this.actionButton1.isDown && this.needsAPoo && this.nearbyEmptySpace()) {
                    var space = this.nearbyEmptySpace();
                    var tree = new Tree(space.x*32, (space.y+1)*32);
                    this.needsAPoo = false;
                    this.actionButton1Timer = world.game.time.now + 1000;
                }
            }
        }

        // update carrying things
        if (this.carrying === "") {
            this.carrySprite.frame = 0;
        } else {
            this.carrySprite.frame = this.carrySpriteFrames[this.carrying];
        }

        // update the stats and timers
        if (this.pregnant) {
            this.pregnancyMonths += world.game.time.physicsElapsed * world.rates.pregnancyRate;
        }
        this.stomach.update();

        // update the hud
        this.heartBar.width = this.stomach.health * 24;
        this.strengthBar.width = this.carryStrength * 24;

        var age = Math.ceil(this.stomach.age);
        this.ageText.text = age + " year" + (age>1?"s":"") + " old";

        var text = "Generation " + this.generations;
        if (this.generationsText.text !== text || this.generationsText.x === 0) {
            this.generationsText.text = text;
            this.generationsText.updateTransform();
            this.generationsText.x = (world.game.width-10) - this.generationsText.width;
        }

        var hungerPercent = this.stomach.getHungerPercent();
        var hungerBarWidth = Math.ceil(this.hungerBarMaxWidth*hungerPercent);
        if (hungerBarWidth < 0) hungerBarWidth = 0;
        if (hungerBarWidth !== this.hungerBarWidth) {
            this.hungerBarWidth = hungerBarWidth;
            this.hungerBar.clear();
            // draw if we are full or flash when we are hungry
            if (hungerPercent > 0.1 || (world.game.time.totalElapsedSeconds() % 0.5) < 0.3) {
                this.hungerBar.lineStyle(2, 0xffffff, 1);
                this.hungerBar.drawRect(0, 0, this.hungerBarMaxWidth, this.hungerBarHeight);
                this.hungerBar.beginFill(0xffffff);
                this.hungerBar.drawRect(0, 0, this.hungerBarWidth, this.hungerBarHeight);
                this.hungerBar.endFill();
            }
        }
    },

    isDead: function() {
        return this.stomach.dead;
    },


    getTilePos: function() {
        return Util.worldToTilePos(this.sprite);
    },
    getTile: function() {
        var tPos = this.getTilePos();
        var mapTile = world.map.getTile(tPos.x, tPos.y);
        return mapTile;
    },

    nearbyTree: function() {
        var tile = this.getTile();
        if (tile && tile.index === world.tiles.tree) {
            return tile.tree;
        }
        return undefined;
    },

    nearbyCorpse: function() {
        var nearbyCorpse = undefined;
        var mapTile = this.getTile();;
        if (mapTile && mapTile.index === world.tiles.corpse) {
            nearbyCorpse = tPos;
        }
        return nearbyCorpse;
    },

    nearbyAnimals: function() {
        var animals = [];
        for (var a = 0 ; a < world.animals.length ; a++) {
            if (world.animals[a].sprite.overlap(this.sprite)) {
                animals.push(world.animals[a]);
            }
        }
        return animals;
    },

    nearbyEmptySpace: function() {
        var nearbyEmptySpace = undefined;
        var tPos = this.getTilePos();
        // check there is no tree, bones or anything else there
        if (!world.map.hasTile(tPos.x, tPos.y)) {
            nearbyEmptySpace = tPos;
        }
        return nearbyEmptySpace;
    },

    nearbyWater: function() {
        var tPos = this.getTilePos();
        var left = world.map.getTile(tPos.x-1, tPos.y+1);
        var right = world.map.getTile(tPos.x+1, tPos.y+1);
        if (left && left.index === world.tiles.water) {
            return left;
        }
        if (right && right.index === world.tiles.water) {
            return right;
        }
        return undefined;
    }
});

module.exports = Player;

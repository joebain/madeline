var world = require("./world");

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

    world.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 1000;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.setSize(8, 32);

    this.sprite.anchor.setTo(.5, 1); //so it flips around its middle

    this.cursors = world.game.input.keyboard.createCursorKeys();
    this.upKeyTimer = 0;

    // status variables
    this.jumpStrength = 1; // up to 3
    this.carryStrength = 1; // up to 3
    this.foodStrength = 1; // up to 3

    this.ageRate = 15 / (30); // 30 secs is 15 years
    this.feedRate = 60; // got to eat once a minute
    this.pregnancyRate = 1 / 10; // 10 seconds is one month (1.5 mins for full pregnancy)

    this.reset();

    // hud
    this.hud = world.game.add.group();
    this.ageText = new Phaser.Text(world.game, 10, 10, "", {font: "60px PixelDart", fill: "#ffffff"});
    this.hud.add(this.ageText);
    this.hungerBar = world.game.add.graphics(10, 60);
    this.hungerBarWidth = 200;
};
_.extend(Player.prototype, {
    reset: function() {
        this.health = 1;
        this.foodClock = this.feedRate;
        this.pregnancyMonths = 0;
        this.age = 0;
        this.pregnant = false;
    },

    update: function() {
        world.game.physics.arcade.collide(this.sprite, world.layers.tiles);

        this.sprite.body.velocity.x = 0;

        if (this.havingSex) {
        } else if (!this.crouching) {
            if (this.cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -this.runSpeed;
                this.sprite.animations.play('run');
                this.sprite.scale.x = -1;
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.body.velocity.x = this.runSpeed;
                this.sprite.animations.play('run');
                this.sprite.scale.x = 1;
            }
            else {
                this.sprite.animations.stop('run', true);
            }
            if (this.cursors.up.isDown && world.game.time.now > this.upKeyTimer) {
                // check if we are under a tree
                var underTree = undefined;
                for (var t = 0 ; t < world.trees.length ; t++) {
                    if (this.sprite.overlap(world.trees[t].sprite)) {
                        underTree = world.trees[t];
                        break;
                    }
                }
                if (underTree && underTree.fruit > 0) {
                    underTree.fruit--;
                    this.foodClock = this.feedRate;
                    this.upKeyTimer = world.game.time.now + 1000;
                }
                // or else we can jump
                else if (this.sprite.body.onFloor()) {
                    this.sprite.body.velocity.y = -500;
                    this.upKeyTimer = world.game.time.now + 1000;
                }
            }
            else if (this.cursors.down.isDown && this.sprite.body.onFloor()) {
                
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
                    } else if (this.age < 16) {
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
                } else {
                    this.crouching = true;
                    this.sprite.animations.play("crouch-down");
                }
            }

            if (!this.sprite.body.onFloor()) {
                this.sprite.animations.stop('run', true);
                this.sprite.frame = 7;
                this.onFloor = false;
            } else {
                if (!this.onFloor) {
                    this.crouching = true;
                    this.sprite.animations.play("land");
                    setTimeout((function() {
                        this.crouching = false;
                    }).bind(this), this.landingDuration);
                }
                this.onFloor = true;
            }
        } else {
            if (!this.cursors.down.isDown) {
                this.sprite.animations.play("stand-up");
                setTimeout((function() { this.crouching = false; }).bind(this), this.crouchDuration);
            }
        }

        // update the stats and timers
        this.age += world.game.time.physicsElapsed * this.ageRate;
        this.foodClock -= world.game.time.physicsElapsed;
        if (this.pregnant) {
            this.pregnancyMonths += world.game.time.physicsElapsed * this.pregnancyRate;
        }

        // update the hud
        var age = Math.ceil(this.age);
        this.ageText.text = age + " year" + (age>1?"s":"") + " old";

        var hungerPercent = Math.ceil(this.hungerBarWidth*(this.foodClock/this.feedRate));
        if (hungerPercent < 0) hungerPercent = 0;
        if (hungerPercent !== this.hungerPercent) {
            this.hungerPercent = hungerPercent;
            this.hungerBar.clear();
            if (this.foodClock > 10 || (world.game.time.totalElapsedSeconds() % 0.5) < 0.4) {
                this.hungerBar.lineStyle(2, 0xffffff, 1);
                this.hungerBar.drawRect(0, 0, this.hungerBarWidth, 20);
                this.hungerBar.beginFill(0xffffff);
                this.hungerBar.drawRect(0, 0, this.hungerPercent, 20);
                this.hungerBar.endFill();
            }
        }
    }
});

module.exports = Player;

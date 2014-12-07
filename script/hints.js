var world = require("./world");

var Hints = {
    caption: function(text, delay, duration) {
        delay = delay || 0;
        duration = duration || 5000;

        var paddingY = 5;
        var paddingX = 10;

        var group = world.game.add.group(world.layers.captions);

        var caption = world.game.add.text(0, 0, text, {font: world.fonts.caption, fill:"#464646"});
        caption.updateTransform();

        var graphics = world.game.add.graphics(0, 0);
        graphics.beginFill(0xecd2a1, 1);
        graphics.drawRoundedRect(-paddingX, -paddingY, caption.width+paddingX*2, caption.height+paddingY*2, 6);
        graphics.endFill();
        graphics.lineStyle(2, 0x464646);
        graphics.drawRoundedRect(-paddingX, -paddingY, caption.width+paddingX*2, caption.height+paddingY*2, 6);

        group.addChild(graphics);
        group.addChild(caption);

        group.x = world.game.width * 0.5 - caption.width*0.5;
        group.y = world.game.height * 0.5 - caption.height*0.5;

        group.alpha = 0;

        world.game.add.tween(group).to({alpha: 1}, 500).delay(delay).start();
        var fadeOut = function() {
            var tween = world.game.add.tween(group).to({alpha: 0}, 500).start();
            tween.onComplete.add(function() {
                group.destroy();
                next();
            });
        }
        var fadeOutTimeout = setTimeout(fadeOut, duration);
        var next = function() {};
        return {
            cancel: function() {
                clearTimeout(fadeOutTimeout);
                fadeOut();
            },
            then: function(f) {
                next = f;
            }
        };
    },

    objectCaption: function(object, text, delay, duration, position, options) {
        delay = delay || 0;
        duration = duration || 5000;
        position = position || "vertical";
        options = options || {};

        var paddingY = 5;
        var paddingX = 10;
        var spacingY = 10;
        var spacingX = 15;

        var offsetX = options.offsetX || 0;
        var offsetY = options.offsetY || 0;

        var group = world.game.add.group(world.layers.captions);

        var caption = world.game.add.text(0, 0, text, {font: world.fonts.caption, fill:"#464646"});
        caption.updateTransform();

        var graphics = world.game.add.graphics(0, 0);
        graphics.beginFill(0xecd2a1, 1);
        graphics.drawRoundedRect(-paddingX, -paddingY, caption.width+paddingX*2, caption.height+paddingY*2, 6);
        graphics.endFill();
        graphics.lineStyle(2, 0x464646);
        graphics.drawRoundedRect(-paddingX, -paddingY, caption.width+paddingX*2, caption.height+paddingY*2, 6);

        group.addChild(graphics);
        group.addChild(caption);

        // positioning
        if (position === "vertical") {
            var idealX = object.x + object.width * 0.5 - caption.width * 0.5 + offsetX;
            if (idealX + caption.width > world.game.width) {
                group.x = world.game.width - caption.width - spacingX;
            } else if (idealX < 0) {
                group.x = spacingX;
            } else {
                group.x = idealX;
            }
            var idealY = object.y - object.height - caption.height - spacingY + offsetY;
            if (idealY < 0) {
                group.y = object.y + spacingY;
            } else {
                group.y = idealY;
            }
        } else if (position === "horizontal") {
            var idealX = object.x + object.width + spacingX + offsetX;
            if (idealX + caption.width > world.game.width) {
                group.x = object.x - spacingX - caption.width;
            } else {
                group.x = idealX;
            }
            var idealY = object.y + object.height * 0.5 - caption.height * 0.5 + offsetY;
            if (idealY + caption.height > world.game.height) {
                group.y = world.game.height - caption.height - spacingY;
            } else if (idealY < 0) {
                group.y = spacingY;
            } else {
                group.y = idealY;
            }
        }

        group.alpha = 0;
        world.game.add.tween(group).to({alpha: 1}, 500).delay(delay).start();
        var fadeOut = function() {
            var tween = world.game.add.tween(group).to({alpha: 0}, 500).start();
            tween.onComplete.add(function() {
                group.destroy();
                next();
            });
        }
        var fadeOutTimeout = setTimeout(fadeOut, duration);
        var next = function() {};
        return {
            cancel: function() {
                clearTimeout(fadeOutTimeout);
                fadeOut();
            },
            then: function(f) {
                next = f;
            }
        };
    }
};

module.exports = Hints;

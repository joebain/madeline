var Util = {
    worldToTilePos: function(pos) {
        return {x: Math.floor(pos.x/32), y: Math.ceil(pos.y/32)-1};
    }
};

module.exports = Util;

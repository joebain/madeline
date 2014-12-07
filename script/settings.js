var Settings = {
    getBool: function(key) {
        return Settings.get(key) === "true";
    },
    get: function(key) {
        return localStorage.getItem(key);
    },
    setBool: function(key, value) {
        Settings.set(key, value ? "true" : "false");
    },
    set: function(key, value) {
        localStorage.setItem(key, value);
    }
};

module.exports = Settings;

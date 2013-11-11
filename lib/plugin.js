
module.exports = exports = MudjsPlugin;

var MudjsPlugin = function() {
    this.initialized = false;
}

MudjsPlugin.prototype.load = function() {
    this.initialized = true;
}

MudjsPlugin.prototype.unload = function() {
    this.initialized = false;
}


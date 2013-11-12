var MudjsPlugin = function(name) {
    this.name = name;
    this.initialized = false;
}

MudjsPlugin.prototype.load = function() {
    this.initialized = true;
}

MudjsPlugin.prototype.unload = function() {
    this.initialized = false;
}


module.exports = exports = MudjsPlugin;
exports.MudjsPlugin = MudjsPlugin;
exports.native = undefined;
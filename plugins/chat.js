
var chat = exports = module.exports = {};

chat.initialized = false;

chat.load = function() {
    console.log("[CHAT] Plugin loaded");
}

chat.unload = function() {
    console.log("[CHAT] Plugin unloaded");
}

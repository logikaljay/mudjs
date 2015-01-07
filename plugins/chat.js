var telnet = require('../lib/telnet');
var connection = new telnet();
var chat = exports = module.exports = {};

chat.initialized = false;

chat.load = function(mudjs) {
    console.log("[CHAT] Plugin loaded");
    console.log(mudjs);
}

chat.unload = function() {
    console.log("[CHAT] Plugin unloaded");
}

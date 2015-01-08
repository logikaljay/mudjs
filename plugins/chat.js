var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};

chat.connection = new telnet();
chat.initialized = false;

chat.load = function(mudjs) {
    console.log("[CHAT] Plugin loaded");

    this.connect('localhost', '4051');
}
chat.unload = function() {
    console.log("[CHAT] Plugin unloaded");
}

chat.connect = function(host, port) {
    this.connection.connect({
        host: host,
        port: port
    });

    this.connection.on('data', function(data) {
	var str = data.toString();
        if (str.indexOf('YES:') > -1) {
            var chatName = str.replace('YES:', '');
            
            // to complete the handshake, send our version
            chat.connection.write('19\nmudjs v0.1\n255');
            //chat.connection.write('123');
        }

	console.log('data received');
        process.stdout.write(data);
        //process.stdout.write('\n');
    });

    this.connection.on('connect', function() {
        console.log("connected to chat");
	chat.connection.write('CHAT:jay\n10.1.1.1\n4050');
    });

    this.connection.on('error', function(err) {
        console.log(err);
    });
}

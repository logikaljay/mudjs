var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};


chat.connection = new telnet();
chat.initialized = false;

chat.load = function(mudjs) {
    console.log("[CHAT] Plugin loaded");

    this.connect('localhost', '4051');
	
	// init commands
	mudjs._commands.chat = function(mudjs, args) {
        if (args.length >= 2) {
	        if (chat.connection !== null || chat.connection !== undefined) {
                chat.connection.write('5\n' + args[0] + '\n' + args[1]);
            }
        } else {
            console.log('Usage: /chat [name] [text]');
        }
	};
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
        console.log(data.length);
        var str = data.toString();
        if (str.indexOf('YES:') > -1) {
		    
            var chatName = str.replace('YES:', '');
            
            // to complete the handshake, send our version
            chat.connection.write('19\nmudjs v0.1\n');
        } else {
            process.stdout.write(data);
		}
    });

    this.connection.on('connect', function() {
        console.log('Connected - Waiting for response');
	    chat.connection.write('CHAT:kanato\n10.1.1.1\n4050');
    });

    this.connection.on('error', function(err) {
        console.log(err);
    });
}

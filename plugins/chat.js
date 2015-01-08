var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};
var util = require('util');

chat.connection = new telnet();
chat.initialized = false;
function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}
chat.load = function(mudjs) {
    console.log("[CHAT] Plugin loaded");

    this.connect('10.1.1.36', '4050');
	
	// init commands
	mudjs._commands.chat = function(mudjs, args) {
        if (chat.connection !== undefined) {
			var data = convertToHex("\033[0;1;31mkanato chats to everyone, " + "'" + args.join(" ") + "'");
			var buf = new Buffer('04'+data+'0A', 'hex');
			console.log(chat);
			chat.connection.write('4foo255'); 
			console.log("written successfully");
			console.log(buf);
			
		} else {
			console.log('you are not connected to anyone');
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
        var str = data.toString();
        if (str.indexOf('YES:') > -1) {
            var chatName = str.replace('YES:', '');
            
            // to complete the handshake, send our version
            chat.connection.write('19\nmudjs v0.1\n255');
        } else {
			console.log(data);
            process.stdout.write(data);
		}
    });

    this.connection.on('connect', function() {
        console.log('Connected - Waiting for response');
	    chat.connection.write('CHAT:kanato\n10.1.1.14050 ');
    });

    this.connection.on('error', function(err) {
        console.log(err);
    });
}

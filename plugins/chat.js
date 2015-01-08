var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};
var util = require('util');
var net = require('net');

chat.initialized = false;

chat.name = "kanato";
chat.connections = [];
chat.messages = {
	MSGPrivate: { 
		send: "%s chats to you, '%s'.", 
		show: "you chat to %s, '%s'." 
	},
	MSGPublic: { 
		send: "%s chats to everyone, '%s'.", 
		show: "you chat to everyone, '%s'." 
	}
};

chat.commands = {
	CMDPublic: "04",
	CMDPrivate: "05",
	CMDEnd: "FF"
}
function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}
chat.load = function(mudjs) {
    console.log("[CHAT] Plugin loaded");

    this.connect('localhost', '4055');
	
	mudjs._commands.chata = function(mudjs, args) {
        chat._sendPublic(args.join(" "));
	};
	
	mudjs._commands.chat = function(mudjs, args) {
		chat._sendPrivate(args.shift(), args.join(" "));
	};
}
chat.unload = function() {
    console.log("[CHAT] Plugin unloaded");
}

chat.connect = function(host, port) {
    var connection = net.Socket();
	connection.connect(port, host, function() {
		console.log("[CHAT] Connected - Waiting for response");
		connection.write('CHAT:'+chat.name+'\n10.1.1.14050 ');
	});

    connection.on('data', function(data) {
        var str = data.toString();
        if (str.indexOf('YES:') > -1) {
            var chatName = str.replace('YES:', '');
            
            // to complete the handshake, send our version
			var data = convertToHex("mudjs v0.1");
			var buf = new Buffer('13' + data + 'FF', 'hex');
			
            connection.write(buf, 'hex');
						
			connection.on('error', function(err) {
				console.log(err);
			});
			
			chat.connections.push({ name: chatName.trim(), fd: connection });
        } else {
            process.stdout.write(data);
		}
    });	
}

chat._sendPublic = function(str) {
	if (this.connections.length > 0) {
		var text = util.format(this.messages.MSGPublic.send, this.name, str);
		var show = util.format(this.messages.MSGPublic.show, str);
		var data = convertToHex(text);
		var buf = new Buffer('04' + data + 'FF', 'hex');
		
		// send str to all connections
		this.connections.forEach(function(connection) {
			connection.fd.write(buf, 'hex');
		});
		
		process.stdout.write(text);
	} else {
		console.log('you are not connected to anyone');
	}
}

chat._sendPrivate = function(name, str) {
	var connection = this._getConnectionByName(name);
	
	if (connection !== undefined) {
		var text = util.format(this.messages.MSGPrivate.send, this.name, str);
		var show = util.format(this.messages.MSGPrivate.show, name, str);
		
		var data = convertToHex(text);
		var buf = new Buffer('05' + data + 'FF', 'hex');
		
		connection.fd.write(buf, 'hex');
		process.stdout.write(show);
	} else {
		console.log('you are not connected to %s', name);
	}
}

chat._getConnectionByName = function(name) {
	var conn = this.connections.filter(function(connection) {
		if (connection.name.toLowerCase() == name.toLowerCase()) {
			return connection;
		}
	});
	
	return conn[0];
}
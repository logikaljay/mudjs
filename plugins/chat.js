var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};
var util = require('util');
var net = require('net');

chat.initialized = false;

chat.name = "kanato";
chat.prefix = "<CHAT>";
chat.connections = [];
chat.msg = {
        _private: { 
		send: "%s chats to you, '%s'.", 
		show: "You chat to %s, '%s'." 
	},
	_public: { 
		send: "%s chats to everyone, '%s'.", 
		show: "You chat to everyone, '%s'." 
	}
};

chat.cmd = {
        _namechange: "01",
	_public: "04",
	_private: "05",
        _version: "13",
        _pingrequest: "1A",
        _pingresponse: "1B",
        _peek: "1C",
        _snoop: "1E",
	_end: "FF"
}

chat.load = function(mudjs) {
    console.log("%s Plugin loaded", chat.prefix);

    this.connect('localhost', '4050');
	
	mudjs._commands.chatall = function(mudjs, args) {
            chat._sendPublic(args.join(" "));
	};
	
	mudjs._commands.chat = function(mudjs, args) {
	    chat._sendPrivate(args.shift(), args.join(" "));
	};
}
chat.unload = function() {
    console.log("%s Plugin unloaded", chat.prefix);
}

chat.connect = function(host, port) {
    var connection = {};
    connection.fd = net.Socket();

    connection.fd.connect(port, host, function() {
        console.log("%s Connected - Waiting for response", chat.prefix);
        var handshake = util.format('CHAT:%s\n%s%s', chat.name, '10.1.1.1', '4050 ');
        connection.fd.write(handshake);
    });

    connection.fd.on('data', function(data) {
        var str = data.toString();
        if (str.indexOf('YES:') > -1) {
            var chatName = str.replace('YES:', '');
            
            // to complete the handshake, send our version
            var data = convertToHex("mudjs v0.1");
            var buf = new Buffer('13' + data + 'FF', 'hex');
			
            connection.fd.write(buf, 'hex');
						
            connection.fd.on('error', function(err) {
                console.log(err);
            });

	    connection.name = chatName.trim();

            chat.connections.push(connection);
        } else {
            // process the incoming data by getting the first byte
            var cmd = data[0].toString(16);

            // format our command for two digit hex with leading 0's
            cmd = ("0" + data[0].toString(16)).substr(-2);
            chat._recvCommand(connection, cmd, data.toString().substring(1, data.length - 1));
        }
    });	
}

chat._recvCommand = function(conn, cmd, str) {
    var cmds = this.cmd;
    switch (cmd) {
        case cmds._public:
            this._showPublic(str);
            break;
        case cmds._private:
            this._showPrivate(str);
            break;
        case cmds._namechange:
            this._showNameChange(conn, str);
            break;
    }
}

chat._showNameChange = function(conn, str) {
    var oldName = conn.name;
    var newName = str.trim();

    // update the connection in the array
    for (var i = 0; i < this.connections.length; i++) {
        if (this.connections[i].name == oldName) {
            this.connections[i].name = newName;
        }
    }

    this._show(util.format("%s has changed their name to %s.", oldName, newName));
}

chat._showPublic = function(str) {
    this._show(str);
}

chat._showPrivate = function(str) {
    this._show(str);
}

chat._sendPublic = function(str) {
    if (this.connections.length > 0) {
        var text = util.format(this.msg._public.send, this.name, str);
        var show = util.format(this.msg._public.show, str);
        var data = convertToHex(text);
	var buf = new Buffer(this.cmd._public + data + this.cmd._end, 'hex');
		
        // send str to all connections
        this.connections.forEach(function(connection) {
            connection.fd.write(buf, 'hex');
	});
		
	this._show(show);
    } else {
        this._show('you are not connected to anyone');
    }
}

chat._sendPrivate = function(name, str) {
    var connection = this._getConnectionByName(name);
	
    if (connection !== undefined) {
        var text = util.format(this.msg._private.send, this.name, str);
        var show = util.format(this.msg._private.show, name, str);
		
        var data = convertToHex(text);
        var buf = new Buffer(this.cmd._private + data + this.cmd._end, 'hex');
		
        connection.fd.write(buf, 'hex');
        this._show(show);
    } else {
        this._show(util.format('you are not connected to %s', name));
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

chat._show = function(str) {
    process.stdout.write(util.format("%s %s", this.prefix, str) + os.EOL);
}


function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}


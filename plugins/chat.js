var telnet = require('../lib/telnet');
var chat = exports = module.exports = {};
var util = require('util');
var net = require('net');
var colors = require('colors');

chat.initialized = false;

chat.name = "changeme";
chat.prefix = "<CHAT>";
chat.numConnections = 0;
chat.connections = [];
chat.msg = {
    _private: {
        send: "\x1B[1m\x1B[31m%s chats to you, '%s'.\x1B[39m\x1B[22m",
        show: "\x1B[1m\x1B[31mYou chat to %s, '%s'.\x1B[39m\x1B[22m"
    },
    _public: {
        send: "\x1B[1m\x1B[31m%s chats to everyone, '%s'.\x1B[39m\x1B[22m",
        show: "\x1B[1m\x1B[31mYou chat to everyone, '%s'.\x1B[39m\x1B[22m"
    }
};

chat.emote = {
    _public: {
        send: "\x1B[1m\x1B[31m%s %s\x1B[39m\x1B[22m",
        show: "\x1B[1m\x1B[31mYou emote to everybody: %s\x1B[39m\x1B[22m"
    }
}

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

chat._commands = ['chatall', 'emoteall', 'chat', 'chatname', 'chatwho', 'call']

chat.load = function(mudjs) {
    this.mudjs = mudjs;
    this._show("Plugin loaded");

    mudjs._commands.add(
        'chatall',
        'Send a public chat message',
        [{
            name: 'message',
            description: 'Message to send to all chat connections',
            optional: false
        }],
        function(mudjs, args) {
            chat._sendPublic(args.join(" "));
        });

    mudjs._commands.add(
        'emoteall',
        'Send a public emote',
        [{
            name: 'message',
            description: 'Message to emote to all chat connections',
            optional: false
        }],
        function(mudjs, args) {
            chat._sendEmote(args.join(" "));
        });

    mudjs._commands.add(
        'chat',
        'Send a private chat message',
        [{
            name: 'name',
            description: 'Chat name to private message',
            optional: false
        },{
            name: 'message',
            description: 'Message to send privately',
            optional: false
        }],
        function(mudjs, args) {
           chat._sendPrivate(args.shift(), args.join(" "));
        });

    mudjs._commands.add(
        'chatname',
        'Change your chat name',
        [{
            name: 'name',
            description: 'Your new chat name',
            optional: false
        }],
        function(mudjs, args) {
            chat._sendNameChange(args[0]);
        });

    mudjs._commands.add(
        'chatwho',
        'List all chat connections',
        [],
        function(mudjs, args) {
            chat._showChatConnections();
        });

    mudjs._commands.add(
        'unchat',
        'Disconnect from a chat',
        [{
            name: 'Connection',
            description: 'Name or number of connection to disconnect',
            optional: false
        }],
        function(mudjs, args) {
            chat._disconnect(args[0]);
        });

    mudjs._commands.add(
        'call',
        'Call a chat server',
        [{
            name: 'host',
            description: 'the hostname or IP of the chat server',
            optional: false
        },{
            name: 'port',
            description: 'the port of the chat server',
            optional: false
        }],
        function(mudjs, args) {
            chat._connect(args[0], args[1]);
        });
}

chat.unload = function(mudjs) {
    // iterate over mudjs._commands removing chat commands
    this._commands.forEach(function(name) {
        mudjs._commands.remove(name);
    });

    // iterate over this.connections - closing each one
    for (var i = 0; i < this.connections.length; i++) {
        var connection = this.connections[i];
        connection.fd.end();
        this.connections.splice(i, 1);
        i--;
    }

    // show that we have unloaded the plugin
    this._show("Plugin unloaded");
}

chat._connect = function(host, port) {
    var connection = {};
    connection.fd = net.Socket();

    connection.fd.connect(port, host, function() {
        chat._show("Connected - Waiting for response", chat.prefix);
        var handshake = util.format('CHAT:%s\n%s%s', chat.name, '10.1.1.1', '4050 ');
        connection.fd.write(handshake);
    });

    connection.fd.on('data', function(data) {
        var str = data.toString();
        if (str.indexOf('YES:') > -1) {
            var chatName = str.replace('YES:', '');
            connection.name = chatName.trim();

            // to complete the handshake, send our version
            var data = convertToHex("mudjs v0.1");
            var buf = new Buffer(chat.cmd._version + data + chat.cmd._end, 'hex');

            // write the handshake to the socket
            connection.fd.write(buf, 'hex');
            connection.fd.on('error', function(err) {
                mudjs.showme(err);
            });

            // increment and add connection to the pool
            chat.connections[chat.numConnections] = connection;
            chat.numConnections++;

            chat._show(util.format("Received response, connection to %s established.", connection.name));
        } else {
            // process the incoming data by getting the first byte
            var cmd = ("0" + data[0].toString(16)).substr(-2);

            // handle the command
            chat._recvCommand(connection, cmd, data.toString().substring(1, data.length - 1));
        }
    });

    connection.fd.on('close', function(err) {
        chat.connections = chat.connections.filter(function(con) {
            return con !== connection;
        });
        chat.numConnections = chat.connections.length;

        chat._show(util.format("%s has been disconnected.", connection.name));
    });
}

chat._disconnect = function(str) {
    var connection;
    if (!isNaN(str)) {
        // we are dealing with a 0-index
        var num = Number(str);
        if (num !== 0) {
            num--;
        }

        connection = this._getConnectionByNumber(num);
    } else {
        connection = this._getConnectionByName(str);
    }

    if (connection !== undefined) {
        connection.fd.end();
    } else {
        this._show(util.format("You are not connected to %s.", str))
    }
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

chat._showChatConnections = function() {
    var chatConnections = [];
    var i = 1;
    chat.connections.forEach(function(connection) {
        chatConnections.push({
            id: i,
            name: connection.name,
            ip: connection.fd.remoteAddress,
            port: connection.fd.remotePort
        });

        i++;
    });

    mudjs.showme(chatConnections);
}

chat._sendNameChange = function(str) {
    var newName = str.trim();

    this.name = newName;
    var data = convertToHex(newName);
    var buf = new Buffer(this.cmd._namechange + data + this.cmd._end, 'hex');

    // send name change to all connections
    this.connections.forEach(function(connection) {
        connection.fd.write(buf, 'hex');
    });

    // show name change
    this._show(util.format('You have changed your name to %s.', newName));
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
    var connection;
    if (isNaN(name)) {
        connection = this._getConnectionByName(name);
    } else {
        connection = this._getConnectionByNumber(Number(name) - 1);
    }

    if (connection !== undefined) {
        var text = util.format(this.msg._private.send, this.name, str);
        var show = util.format(this.msg._private.show, connection.name, str);

        var data = convertToHex(text);
        var buf = new Buffer(this.cmd._private + data + this.cmd._end, 'hex');

        connection.fd.write(buf, 'hex');
        this._show(show);
    } else {
        this._show(util.format('You are not connected to %s.', name));
    }
}

chat._sendEmote = function(str) {
    if (this.connections.length > 0) {
        var text = util.format(this.emote._public.send, this.name, str);
        var show = util.format(this.emote._public.show, str);
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

chat._show = function(str, trim) {
    if (trim) {
        // remove the first char (command) from the output
        str = str.substring(1, str.length - 1);
        chat.mudjs.showme(util.format("%s %s", this.prefix, str).red);
    } else {
        chat.mudjs.showme(util.format("%s %s", this.prefix, str).red);
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

chat._getConnectionByNumber = function(number) {
    if (!isNaN(number)) {
        if (this.connections.length >= number) {
            return this.connections[number];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

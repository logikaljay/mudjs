var readline = require('readline'),
    telnet = require('./telnet'),
    emitter = require('events').EventEmitter,
    commands = require('./commands')
    rl = readline.createInterface(process.stdin, process.stdout),
    colors = require('colors')
    fs = require('fs')
;

var mudjs = exports = module.exports = Object.create(emitter.prototype);

String.prototype.textOnly = function() {
    return this.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
               .replace(/\[\d;\d{2}m/g,'')
               .replace(/\[\dm/g,'')
               .replace(/\[\d{2}m/g,'')
    ;
}

mudjs.win = null;
mudjs.rl = rl;
mudjs.session = 'default';
mudjs._commands = commands;
mudjs._triggers = [];
mudjs._aliases = [];
mudjs._tickers = [];
mudjs._plugins = [];
mudjs.currentBuffer = '';
mudjs.lastBuffer = '';
mudjs.responseCallback = [];

mudjs.startAndConnect = function(host, port) {
    this.start();
    this.connect(host, port);
}

mudjs.start = function() {
    this.rl.setPrompt('');
    this.rl.prompt();
    var mjs = this;

    process.stdin.on('data', function(data) {
        if (data.toString() == '\r') {
            var input = mjs.parseInput( mjs.currentBuffer );

            if (input !== false) {
                mjs.emit('command', input);
                mjs.sendCommand(input);
                mjs.lastBuffer = mjs.currentBuffer.trim();
            }
        } else if (['\b','\x7f','\x1b\x7f','\x1b\b'].indexOf(data.toString()) > -1) {
            // Backspace detected
            //mjs.rl.write(null, {ctrl: true, name: 'u'});
        } else {
        }
    });

    this.rl.on('line', function(line) {
        mjs.currentBuffer = line;
    }).on('close', function() {
        process.exit(0);
    });

    // load the previous session
    this._commands.run('load', this, [ this.session ]);
}

mudjs.connect = function(host, port) {
    var mjs = this;

    if (!port) port = 23;
    this.connection = new telnet();

    this.connection.connect({
        host: host,
        port: port
    });

    this.connection.on('data', function(data) {
        //this.win.print(data);
        process.stdout.write(data);
        process.stdout.write('\n');
        mjs.emit('trigger', data.toString());

        if (mudjs.responseCallback.length > 0) {
            mudjs.responseCallback.shift()(data.toString());
        }
    });
    this.connection.on('error', function(err) {
        console.error(err);
        process.exit(0);
    });
};

mudjs.sendCommand = function(command, callback) {
    var commands = command.split(';');
    if (callback) {
        mudjs.responseCallback.push(callback);
    }
    commands.forEach(function(command) {
        if (mudjs.connection !== undefined) {
            mudjs.connection.write(command + '\r\n');
        } else {
            console.log("You are not currently not connected - use /session to connect.");
        }
    });
};

mudjs.on('trigger', function(line) {
    for (var i in mudjs._triggers) {
        var trigger = new RegExp(mudjs._triggers[i].trigger);
        var command = mudjs._triggers[i].command;

        if (trigger.test(line)) {
            mudjs.sendCommand(command);
            console.log(command.yellow)
        }
    }
});

mudjs.parseInput = function(input) {
    if (input.length > 0 && input.substring(0,1) == '/') {
        var tokens = input.split('/')[1].split(' ');
        var command = tokens.shift();

        // we need to check that we meet the conditions of the command
        var arguments = tokens;
        var cmd = mudjs._commands.find(command);

        if (cmd !== undefined) {
            // build array of non-optional arguments
            var compulsory = [];

            cmd.args.forEach(function(argument) {
                if (!argument.optional) {
                    compulsory.push(argument.name);
                }
            });

            if (compulsory.length <= tokens.length) {
                cmd.init(mudjs, tokens);
            } else {
                mudjs._commands.run('help', this, []);
            }
        }

        return false;
    }
    if (input.length > 0) {
        var tokens = input.split(' ');
        if (tokens.length > 0) {
            if (this._aliases.hasOwnProperty(tokens[0])) {
                var command = this._aliases[tokens[0]];
                mudjs.sendCommand(command);
                console.log(command.yellow)
                return false;
            }
        }
    }

    return input;
}

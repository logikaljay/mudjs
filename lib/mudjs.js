var readline = require('readline'),
    telnet = require('./telnet'),
    emitter = require('events').EventEmitter,
    commands = require('./commands')
    procedures = require('./procedures')
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

mudjs.rl = rl;
mudjs.session = 'default';
mudjs._commands = commands;
mudjs._procedures = procedures;
mudjs._triggers = [];
mudjs._aliases = [];
mudjs._tickers = [];
mudjs._plugins = [];
mudjs._vars = [];
mudjs._substitutes = [];
mudjs.currentBuffer = '';
mudjs.lastBuffer = '';
mudjs.responseCallback = [];

mudjs.startAndConnect = function(host, port) {
    this.start();
    this.connect(host, port);
}

mudjs.start = function() {
    this.rl.setPrompt('> ');
    this.rl.prompt(true);
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
        mudjs.showme(data.toString());
        mjs.emit('trigger', data.toString().textOnly());

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
    if (command !== undefined) {
        var commands = command.split(';');
        if (callback) {
            mudjs.responseCallback.push(callback);
        }
        commands.forEach(function(command) {
            if (mudjs.connection !== undefined) {
                command = mudjs._procedures.process(mudjs, command);
                mudjs.connection.write(command + '\r\n');
            } else {
                mudjs.showme("You are not currently not connected - use /session to connect.");
            }
        });
    }
};

mudjs.on('trigger', function(line) {
    for (var i in mudjs._triggers) {
        if (mudjs._triggers[i].enabled) {
            var trigger = new RegExp(mudjs._triggers[i].trigger);
            var command = mudjs._triggers[i].command;

            if (trigger.test(line)) {
                var matches = line.match(trigger);
                for (var i = 0; i < matches.length; i++) {
                    // /trigger {<%0\/%1hp %2\/%3m %4>} {/var currentHP %0;/var currentMana %2}
                    command = command.replace("%" + i, matches[i + 1]);
                }

                // check if this is multiple commands
                if (command.indexOf(';') > -1) {
                    var commands = command.split(';')
                    commands.forEach(function(cmd) {
                        mudjs.parseInput(cmd);
                    });
                } else {
                    mudjs.parseInput(command)
                }
            }
        }
    }
});

mudjs.parseInput = function(input) {
    if (input.length > 0 && input.substring(0,1) == '/') {
        var array = input.split(' ');
        var command = array.shift().replace('/', '');
        var tokens = array;

        // we need to check that we meet the conditions of the command
        var cmd = mudjs._commands.find(command);

        if (cmd == null) {
            mudjs.showme("Unknown command: " + command);
            return;
        }

        if (cmd !== undefined) {
            // build array of non-optional arguments
            var compulsory = [];

            cmd.args.forEach(function(argument) {
                if (!argument.optional) {
                    compulsory.push(argument.name);
                }
            });

            if (compulsory.length <= tokens.length) {
                // firstly - join tokens into string
                var str = tokens.join(" ");

                if (str.indexOf('%') > -1) {
                    // process str through procedures
                    str = mudjs._procedures.process(mudjs, str);

                    // split str into tokens
                    tokens = str.split(" ");
                }

                // init the command
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
            if (this._aliases[tokens[0]]) {
                var command = this._aliases[tokens[0]];
                tokens.shift();
                command = command + " " + tokens.join(' ');
                if (command[0] == '/') {
                    mudjs.parseInput(command);
                } else {
                    mudjs.sendCommand(command);
                }
                return false;
            }
        }
    }

    return input;
}

mudjs.parseOutput = function(data) {
    // iterate over mudjs._substitutions
    mudjs._substitutes.forEach(function(sub) {
        // test data against sub.find
        if (data.indexOf(sub.find) > -1 && sub.enabled) {
            // replace sub.match with sub.replace
            data = data.replace(sub.find, sub.replace);
        }
    });

    return data;
}

mudjs.showme = function(data) {
    var data = data || "";
    data = mudjs.parseOutput(data);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    // display the data and reset ansi color
    console.log(data + '\x1B[39m');

    rl.prompt(true);
}

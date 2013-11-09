var readline = require('readline'),
    telnet = require('./telnet'),
    emitter = require('events').EventEmitter,
    coreCommands = require('./commands')
    rl = readline.createInterface(process.stdin, process.stdout),
    colors = require('colors');

var mudjs = exports = module.exports = Object.create(emitter.prototype);

mudjs.rl = rl;
mudjs.session = 'default';
mudjs._commands = coreCommands;
mudjs._triggers = [];
mudjs._aliases = [];
mudjs.currentBuffer = '';
mudjs.lastBuffer = '';

mudjs.connect = function(host, port) {
    this.rl.setPrompt('');
    this.rl.prompt();
    var mjs = this;

    if (!port) port = 23;
    this.connection = new telnet();

    this.connection.connect({
        host: host,
        port: port
    });

    this.connection.on('data', function(data) {

        process.stdout.write(data);
        process.stdout.write('\n');
        mjs.emit('trigger', data.toString());
    });
    this.connection.on('error', function(err) {
        console.error(err);
        process.exit(0);
    });

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

    this._commands.load(this, [ this.session ]);
};

mudjs.sendCommand = function(command) {
    var commands = command.split(';');

    commands.forEach(function(command) {
        mudjs.connection.write(command + '\r\n');
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

        if (mudjs._commands.hasOwnProperty(command) !== false) {
            var command = mudjs._commands[command](mudjs, tokens);
            return false;
        }
        console.log('Unknown command: ' + command);
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
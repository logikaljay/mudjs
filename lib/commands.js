var fs = require('fs')
    os = require('os')
;

var coreCommands = exports = module.exports = {};

coreCommands.help = function(mudjs, args) {
    console.log(
        'MudJS by Andy Baird' + os.EOL +
        '-------------------' + os.EOL +
        '/session [host] [port] - Connect to a MUD.' + os.EOL +
        '/save [profile] - Save the currently loaded profile. '  + os.EOL +
        '/load [profile] - Load a saved profile.' + os.EOL +
        '/alias { [alias name } { [alias command } - Create an alias for a command.' + os.EOL +
        '/trigger { [trigger] } { [reaction] } - Execute reaction when trigger occurs. JavaScript RegExp compatible' + os.EOL +
        '/echo [ text ] - Echo text back to the screen' + os.EOL,
        '/r [ X ] [ command ] - Repeat command X times' + os.EOL,
        '/ticker [ X ] [ command ] - Every X seconds, perform command' + os.EOL,
        '/plugin [ plugin name ] - Load a plugin with given name' + os.EOL,
        '/clear - Clear the screen' + os.EOL
    );
}

coreCommands.session = function(mudjs, args) {
    if (args.length < 2) {
        console.log('Usage: /session [host] [port]');
        return;
    }

    var host = args.shift();
    var port = parseInt(args.shift());
    mudjs.connect(host, port);
}

coreCommands.tickers = function(mudjs, args) {

}

coreCommands.stopTicker = function(mudjs, args) {
    
}

coreCommands.ticker = function(mudjs, args) {
    if (args.length < 2) {
        console.log('Usage: /ticker [x] [command]')
        return;
    }

    var interval = parseInt(args.shift());
    var command = args.join(' ');

    var ticker = setInterval(
        function() {
            mudjs.sendCommand(command);
        }, (interval * 1000)
    );
    mudjs._tickers.push(ticker);
}

coreCommands.repeat = coreCommands.r = function(mudjs, args) {
    if (!args[0] || !args[1]) {
        console.log('Usage: /r [x] [command] ');
        return;
    }
    var numTimes = parseInt(args.shift());
    var command = args.join(' ');

    console.log('Executing `' + command + '` ' + numTimes + ' times');

    for (var i=0;i<numTimes;i++) {
        mudjs.sendCommand(command);
    }
}

coreCommands.trigger = function(mudjs, args) {
    if (args.length === 0) {
        if (mudjs._triggers.length === 0) {
            console.log('No active triggers');
            return;
        }
        console.log('Active triggers: ');
        mudjs._triggers.forEach(function(trig) {
            console.log('"' + trig.trigger + '": ' + trig.command);
        });
        return;
    }
    var args = args.join(' ');
    var regex = /\{(.+)\}\s*\{(.+)\}/i;

    var matches = args.match(regex);

    if (matches && matches.length > 2) {
        // Replace %0, %1 etc with (.+)
        var trigger = matches[1].trim().replace(/\%[0-99]/i,'(.+)');

        var command = matches[2].trim();

        mudjs._triggers.push({ trigger: trigger, command: command });

        console.log('Trigger added. `' + command + '` will be executed when the text `' + trigger +'` appears')
    } else {
        console.log('Invalid trigger.')
        console.log('Format: /trigger { My Trigger Text } { My Trigger Result }');
    }
};


coreCommands.alias = function(mudjs, args) {

    if (args.length === 0) {
        if (mudjs._aliases.length === 0) {
            console.log('No active aliases');
            return;
        }
        console.log('Active aliases: ');
        mudjs._aliases.forEach(function(alias) {
            console.log('"' + alias.alias + '": ' + alias.command);
        });
        return;
    }

    var args = args.join(' ');
    var regex = /\{(.+)\}\s*\{(.+)\}/i;

    var matches = args.match(regex);

    if (matches && matches.length > 2) {
        var alias = matches[1].trim();
        var command = matches[2].trim();

        mudjs._aliases[alias] = command;

        console.log('Alias added. `' + alias + '` will now execute command `' + command + '`');
    } else {
        console.log('Invalid alias');
        console.log('Format: /alias { Alias } { Command to execute }');
    }

};

coreCommands.save = function(mudjs, args) {
    var file = 'mudjs.default.json';

    if (args.length > 1) {
        file = 'mudjs.' + args[0] + '.json';
    }

    var config = {
        triggers: mudjs._triggers,
        aliases: mudjs._aliases
    }

    fs.writeFile(file, JSON.stringify(config), function(err) {
        if (err) {
            console.log('Could not save file: ' + err);
        } else {
            console.log('Saved '+ file);
        }

    });
}

coreCommands.plugin = function(mudjs, args) {
    var pluginsDir = './../plugins';
    if (!fs.existsSync(pluginsDir)) {
        pluginsDir = './plugins';
    }

    fs.readdir(pluginsDir, function(err, files) {
        if (err) {
            console.log('Could not read plugins directory: ' + err);
            return;
        }
        if (!args[0]) {
            console.log('Usage: /plugin [plugin name]');
            return;
        }
        var pluginName = args[0];
        var foundPlugin = false;
        files.forEach(function(file) {
            if (file.indexOf('.js') > -1) {
                var baseFileName = file.split('.')[0];
                if (baseFileName == pluginName) {
                    foundPlugin = true;
                }
            }
        });
        if (foundPlugin) {
            if (mudjs._plugins.hasOwnProperty(pluginName)) {
                mudjs._plugins[pluginName].unload();
                mudjs._plugins[pluginName] = null;
                for (var i=0;i<require.cache.length;i++) {

                }
                for (var key in require.cache) {
                    if (key.indexOf(pluginName + '.js') > -1) {
                        delete require.cache[key];
                    }
                }
            }
            var plugin = require(pluginsDir' + pluginName);
            if (!plugin.hasOwnProperty('initialized') || !plugin.load || !plugin.unload) {
                console.log('Could not load plugin: file does not appear to be a valid plugin');
                return;
            }
            mudjs._plugins[pluginName] = plugin;
            mudjs._plugins[pluginName].load();

        } else {
            console.log(plugin + ' plugin not found');
            return;
        }

    });
}

coreCommands.load = function(mudjs, args) {
    var file = 'mudjs.default.json';

    if (args.length > 1) {
        file = 'mudjs.' + args[0] + '.json';
    }

    fs.readFile(file, function(err, data) {
        if (err) {
            console.log('Could not open ' + file + ': ' + err);
            return;
        }
        var config = JSON.parse(data);
        mudjs._triggers = config.triggers;
        mudjs._aliases = config.aliases;
    });
}

coreCommands.echo = function(mudjs, args) {
    console.log(args.join(' '));
};

coreCommands.clear = function(mudjs, args) {
    process.stdout.write("\033[2J\033[0f");
}

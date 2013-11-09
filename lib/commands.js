var fs = require('fs');

var coreCommands = exports = module.exports = {};

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
        var trigger = matches[1].trim();
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
    })
}

coreCommands.echo = function(mudjs, args) {
    console.log(args.join(' '));
};

coreCommands.clear = function(mudjs, args) {
    process.stdout.write("\033[2J\033[0f");
}
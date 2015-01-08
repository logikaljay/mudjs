var cmd_alias = (function() {
    'use strict';

    var cmd_alias = {
        name: 'alias',
        description: 'Create an alias for a command.',
        args: [
            {
                name: 'name',
                description: 'The alias',
                optional: false
            },
            {
                name: 'command',
                description: 'The command that gets run',
                optional: false
            }
        ],
        init: function(mudjs, args) {
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

        }
    };

    return cmd_alias;

}());

module.exports = cmd_alias;
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
                    mudjs.showme('No active aliases');
                    return;
                }
                mudjs.showme('Active aliases: ');
                mudjs._aliases.forEach(function(alias) {
                    mudjs.showme('"' + alias.alias + '": ' + alias.command);
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

                mudjs.showme('Alias added. `' + alias + '` will now execute command `' + command + '`');
            } else {
                mudjs.showme('Invalid alias');
                mudjs.showme('Format: /alias { Alias } { Command to execute }');
            }

        }
    };

    return cmd_alias;

}());

module.exports = cmd_alias;

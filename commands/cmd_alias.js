var cmd_alias = (function() {
    'use strict';

    var cmd_alias = {
        name: 'alias',
        description: 'Create an alias for a command.',
        args: [
            {
                name: 'name',
                description: 'The alias',
                optional: true
            },
            {
                name: 'command',
                description: 'The command that gets run',
                optional: true
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
            var regex = /(\{[^{}]*\}).*(\{[^{}]*\})/i;
            var matches = args.match(regex);

            if (matches && matches.length > 2) {
                // format the alias and group
                var alias = mudjs.removeBlocks(matches[1]);
                var group = mudjs.removeBlocks(matches[2]);

                // get the command
                var command = matches[0].replace('{' + alias + '}', '').replace('{' + group + '}', '').trim()
                var innerCommand = command.match(/\{(.*)\}/i);
                command = innerCommand[1];

                mudjs._aliases[alias] = { alias: alias, command: command, group: group, enabled: true };

                mudjs.showme('Alias added. `' + alias + '` will now execute command `' + command + '`');
            } else {
                mudjs.showme('Invalid alias');
                mudjs.showme('Format: /alias {Alias} {Command to execute}');
            }

        }
    };

    return cmd_alias;

}());

module.exports = cmd_alias;

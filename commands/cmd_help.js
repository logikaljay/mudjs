var util = require('util');

var cmd_help = (function() {
    'use strict';

    var cmd_help = {
        name: 'help',
        description: 'List all of the commands and show help',
        args: [
            {
                name: 'command',
                description: 'show help for a specific command',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            // check if we are looking for specific help, or all help
            if (args.length == 0) {
                // iterate over all commands, listing help
                mudjs._commands._cmds.forEach(function(cmd) {
                    console.log(util.format("/%s - %s", cmd.name, cmd.description));
                });
            } else {
                // find specific help
                var cmd = mudjs._commands.find(args[0]);
                if (cmd !== undefined) {
                    var args = "";
                    var argsDesc = "";
                    cmd.args.forEach(function(arg) {
                        args += util.format("[%s] ", arg.name);
                        argsDesc += util.format("\t[%s] - %s %s\n", 
                            arg.name, 
                            arg.description, 
                            arg.optional ? "(optional)" : "");
                    });

                    console.log(util.format("/%s %s- %s", cmd.name, args, cmd.description));
                    console.log(argsDesc)
                }
            }
        }
    };

    return cmd_help
}());

module.exports = cmd_help;
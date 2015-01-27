var util = require('util');
var Table = require('cli-table');

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
                var nameWidth = 0;
                var table = new Table({
                    style : {compact : true, 'padding-left' : 1},
                    head: ['Name', 'Description']
                });

                // iterate over all commands, listing help
                mudjs._commands._cmds.forEach(function(cmd) {
                    if (nameWidth.length < cmd.name.length) {
                        nameWidth = cmd.name.length + 2;
                    }

                    table.push([cmd.name, cmd.description]);
                });
                mudjs.showme(table.toString());

            } else {
                // find specific help
                var cmd = mudjs._commands.find(args[0]);
                if (cmd !== undefined) {
                    var cols = process.stdout.columns - 4;
                    var nameWidth = args[0].length + 2;
                    var descWidth = cols - nameWidth;

                    var table = new Table({
                        head: ['', 'Name', 'Description', '']
                    });

                    var args = "";
                    table.push({ 'command': [ cmd.name, cmd.description, '']})
                    cmd.args.forEach(function(arg) {
                        args += util.format("[%s] ", arg.name);
                        table.push({ 'param': [ arg.name, arg.description, arg.optional ? "(optional)" : "compulsory" ]})
                    });

                    //mudjs.showme(argsDesc)
                    mudjs.showme(table.toString());
                    mudjs.showme(util.format("EG: /%s %s- %s", cmd.name, args, cmd.description));
                }
            }
        }
    };

    return cmd_help
}());

module.exports = cmd_help;

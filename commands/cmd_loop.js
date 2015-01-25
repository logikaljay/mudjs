var cmd_loop = (function() {
    'use strict';

    var cmd_loop = {
        name: 'loop',
        description: 'loop from a to b, executing a command at each step',
        args: [
        {
            name: 'start',
            description: 'The starting number',
            optional: false
        },
        {
            name: 'end',
            description: 'The ending',
            optional: false
        },
        {
            name: 'command',
            description: 'The command to run %count will be the current iteration',
            optional: false
        }
    ],
    init: function(mudjs, args) {
        var regex = /\{(.+)\}.\{(.+)\}.\{(.+)\}/;
        var input = args.join(' ');

        var matches = input.match(regex);
        if (matches && matches.length > 3) {
            var start = Number(matches[1]);
            var end = Number(matches[2]);
            var command = matches[3];

            for (var i = start; i <= end; i++) {
                var tmpCommand = command;
                if (tmpCommand.indexOf('%count') > -1) {
                    tmpCommand = command.replace('%count', i);
                }

                mudjs.parseInput(tmpCommand);
            }

        }
    }
};

return cmd_loop;

}());

module.exports = cmd_loop;

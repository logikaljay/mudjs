var cmd_repeat = (function() {
    'use strict';

    var cmd_repeat = {
        name: 'repeat',
        description: 'Repeat command X times',
        args: [
            {
                name: 'count',
                description: 'Number of times to repeat the command',
                optional: false
            },
            {
                name: 'command',
                description: 'Command to repeat',
                optional: false
            }
        ],
        init: function(mudjs, args) {
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
    };

    return cmd_repeat;

}());

module.exports = cmd_repeat;
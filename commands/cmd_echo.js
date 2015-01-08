var cmd_echo = (function() {
    'use strict';

    var cmd_echo = {
        name: 'echo',
        description: 'Echo any content supplied after the command',
        args: [
            {
                name: 'content',
                description: 'content to echo',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            console.log(args.join(' '));
        }
    };

    return cmd_echo;

}());

module.exports = cmd_echo;
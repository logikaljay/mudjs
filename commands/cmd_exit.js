var cmd_exit = (function() {
    'use strict';

    var cmd_exit = {
        name: 'exit',
        description: 'Exit mudjs',
        args: [],
        init: function(mudjs, args) {
            process.exit(0);
        }
    };

    return cmd_exit;

}());

module.exports = cmd_exit;

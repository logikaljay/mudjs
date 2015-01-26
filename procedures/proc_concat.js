var util = require('util');

var proc_concat = (function() {
    'use strict';

    var proc_concat = {
        name: 'concat',
        description: 'Join two strings',
        args: [
        {
            name: 'text',
            description: 'Comma seperated list of strings to join',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var text = args.join(" ");
            var strings = text.split(',');

            return strings.join(" ");
        }
    };

    return proc_concat;

}());

module.exports = proc_concat;

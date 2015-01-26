var util = require('util');

var proc_len = (function() {
    'use strict';

    var proc_len = {
        name: 'len',
        description: 'Return the length of the args',
        args: [
        {
            name: 'text',
            description: 'The text calculate the length for',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            return args.join(" ").length;
        }
    };

    return proc_len;

}());

module.exports = proc_len;

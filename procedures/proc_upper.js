var util = require('util');

var proc_upper = (function() {
    'use strict';

    var proc_upper = {
        name: 'upper',
        description: 'Convert args to upper case',
        args: [
        {
            name: 'text',
            description: 'The text to make uppercase',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            return args.join(" ").toUpperCase();
        }
    };

    return proc_upper;

}());

module.exports = proc_upper;

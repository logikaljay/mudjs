var util = require('util');

var proc_lower = (function() {
    'use strict';

    var proc_lower = {
        name: 'lower',
        description: 'Show a color',
        args: [
        {
            name: 'text',
            description: 'The text to make lowercase',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            return args.join(" ").toLowerCase();
        }
    };

    return proc_lower;

}());

module.exports = proc_lower;

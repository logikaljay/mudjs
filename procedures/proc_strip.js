var util = require('util');

var proc_strip = (function() {
    'use strict';

    var proc_strip = {
        name: 'strip',
        description: 'strip any non ascii character out',
        args: [
        {
            name: 'text',
            description: 'The text to strip',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            return args.join(" ").textOnly();
        }
    };

    return proc_strip;

}());

module.exports = proc_strip;

var util = require('util');

var proc_trim = (function() {
    'use strict';

    var proc_trim = {
        name: 'trim',
        description: 'Trim whitespace from the end of the string',
        args: [
        {
            name: 'text',
            description: 'Text to trim whitespace from',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var text = args.join(" ");
            return text.trim();
        }
    };

    return proc_trim;

}());

module.exports = proc_trim;

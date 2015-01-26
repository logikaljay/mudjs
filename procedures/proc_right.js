var util = require('util');

var proc_right = (function() {
    'use strict';

    var proc_right = {
        name: 'right',
        description: 'display number of characters from the right',
        args: [
        {
            name: 'text',
            description: 'The text substring',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var input = args.join(" ");
            var text = input.substring(0, input.lastIndexOf(','));
            var count = input.replace(text + ',', '');
            return text.substring(text.length - count, text.length);
        }
    };

    return proc_right;

}());

module.exports = proc_right;

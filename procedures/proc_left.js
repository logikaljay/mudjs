var util = require('util');

var proc_left = (function() {
    'use strict';

    var proc_left = {
        name: 'left',
        description: 'display number of characters from position 0',
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
            var count = input.replace(text + ",", '');
            return text.substring(0, count);
        }
    };

    return proc_left;

}());

module.exports = proc_left;

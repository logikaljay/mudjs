var util = require('util');

var proc_char = (function() {
    'use strict';

    var proc_char = {
        name: 'char',
        description: 'return a char from the input',
        args: [
        {
            name: 'text',
            description: 'The text to process',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var text = args.join(" ");
            var input = text.substring(0, text.lastIndexOf(','));
            var index = text.replace(input + ",", '');

            return input[Number(index) - 1];
        }
    };

    return proc_char;

}());

module.exports = proc_char;

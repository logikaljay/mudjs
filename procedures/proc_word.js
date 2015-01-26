var util = require('util');

var proc_word = (function() {
    'use strict';

    var proc_word = {
        name: 'word',
        description: 'return a word from the input',
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
            var array = input.split(" ");

            return array[Number(index) - 1];
        }
    };

    return proc_word;

}());

module.exports = proc_word;

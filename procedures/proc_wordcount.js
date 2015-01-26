var util = require('util');

var proc_wordcount = (function() {
    'use strict';

    var proc_wordcount = {
        name: 'wordcount',
        description: 'Return the number of words',
        args: [
        {
            name: 'text',
            description: 'the text to count the words in',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var input = args.join(" ").trim();
            return input.split(" ").length;
        }
    };

    return proc_wordcount;

}());

module.exports = proc_wordcount;

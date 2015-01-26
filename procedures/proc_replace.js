var util = require('util');

var proc_replace = (function() {
    'use strict';

    var proc_replace = {
        name: 'replace',
        description: 'Replace text with other text',
        args: [
        {
            name: 'text',
            description: 'The text to replace',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var input = args.join(" ");
            var text = input.substring(0, input.indexOf(','));
            var coords = input.replace(text + ',', '').split(',');

            return text.replace(coords[0], coords[1]);
        }
    };

    return proc_replace;

}());

module.exports = proc_replace;

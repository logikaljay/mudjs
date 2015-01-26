var util = require('util');

var proc_padleft = (function() {
    'use strict';

    var proc_padleft = {
        name: 'padleft',
        description: 'Pad the left of the input with whitespace',
        args: [
        {
            name: 'text',
            description: 'Text to trim whitespace from',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var text = args.join(" ");
            var input = text.substring(0, text.lastIndexOf(','));

            var padding = text.replace(input + ',', '');

            var output = "";
            for (var i = 0; i < padding; i++) {
                output += " "
            }

            return output + input;
        }
    };

    return proc_padleft;

}());

module.exports = proc_padleft;

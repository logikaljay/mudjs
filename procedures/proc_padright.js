var util = require('util');

var proc_padright = (function() {
    'use strict';

    var proc_padright = {
        name: 'padright',
        description: 'Pad the right of the input with whitespace',
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

            return input + output;
        }
    };

    return proc_padright;

}());

module.exports = proc_padright;

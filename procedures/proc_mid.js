var util = require('util');

var proc_mid = (function() {
    'use strict';

    var proc_mid = {
        name: 'mid',
        description: 'display number of characters from the left and right',
        args: [
        {
            name: 'text',
            description: 'The text substring',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var input = args.join(" ");
            var text = input.substring(0, input.indexOf(','));

            var coords = input.replace(text + ',', '').split(',');
            var left = coords[0];
            var right = coords[1];

            return text.substring(left, text.length - right);
        }
    };

    return proc_mid;

}());

module.exports = proc_mid;

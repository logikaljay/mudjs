var util = require('util');

var proc_isempty = (function() {
    'use strict';

    var proc_isempty = {
        name: 'isempty',
        description: 'true if text supplied is empty',
        args: [
        {
            name: 'text',
            description: 'The text to check',
            optional: true
        }
        ],
        init: function(mudjs, procedure, args) {
            return args.length < 0;
        }
    };

    return proc_isempty;

}());

module.exports = proc_isempty;

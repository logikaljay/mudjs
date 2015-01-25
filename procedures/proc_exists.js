var util = require('util');

var proc_exists = (function() {
    'use strict';

    var proc_exists = {
        name: 'exists',
        description: 'Returns true if variable exists',
        args: [
        {
            name: 'variable',
            description: 'The variable to check',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            if (mudjs._vars) {
                return mudjs._vars[args[0]] ? true : false;
            } else {
                return false;
            }
        }
    };

    return proc_exists;

}());

module.exports = proc_exists;

var util = require('util');

var proc_variable = (function() {
    'use strict';

    var proc_variable = {
        name: 'variable',
        description: 'Return a variable.',
        args: [
        {
            name: 'name',
            description: 'The variable name',
            optional: true
        }
        ],
        init: function(mudjs, procedure, args) {
            var vars = mudjs._variables;

            var key = args[0];
            if (vars[key] !== undefined) {
                return vars[key];
            } else {
                return "";
            }
        }
    };

    return proc_variable;

}());

module.exports = proc_variable;

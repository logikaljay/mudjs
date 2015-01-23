var util = require('util');

var cmd_var = (function() {
    'use strict';

    var cmd_var = {
        name: 'variable',
        description: 'Save a variable as a name.',
        args: [
            {
                name: 'name',
                description: 'The variable name',
                optional: true
            },
            {
                name: 'variable',
                description: 'The variable to save',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            var vars = mudjs._vars;

            if (args.length == 0) {
                // list all vars
                mudjs.showme();
                mudjs.showme("VARIABLES:".white)
                mudjs.showme("---------------------------");
                for (var key in vars) {
                    mudjs.showme(util.format("%var(%s) = %s", key, vars[key]).toString().white);
                }
                mudjs.showme();

                return;
            }

            // find and set specific var
            var key = args.shift();
            vars[key] = args.join(" ");
        }
    };

    return cmd_var;

}());

module.exports = cmd_var;

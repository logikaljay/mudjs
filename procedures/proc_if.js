var util = require('util');

var proc_if = (function() {
    'use strict';

    var proc_if = {
        name: 'if',
        description: 'evaluate statement',
        args: [
        {
            name: 'statement',
            description: 'The statement to evaluate',
            optional: false
        }, {
            name: 'true',
            description: 'gets evaluated if the statement is true',
            optional: false
        }, {
            name: 'false',
            description: 'gets evaluated if the statement is false',
            optional: false
        }
        ],
        init: function(mudjs, procedure, args) {
            var vars = mudjs._vars;

            // join the args to be a string
            var total = args.join(" ");

            var matches = total.match(/(.+)\?(.+):(.+)/i);

            if (matches.length > 3) {
                var statement = matches[1].trim();
                var trueCondition = matches[2].trim();
                var falseCondition = matches[3].trim();

                if (eval(statement)) {
                    return trueCondition;
                } else {
                    return falseCondition;
                }
            }

            return "";
        }
    };

    return proc_if;

}());

module.exports = proc_if;

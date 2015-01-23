var cmd_if = (function() {
    'use strict';

    var cmd_if = {
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
        init: function(mudjs, args) {
            var vars = mudjs._vars;

            // join the args to be a string
            var total = args.join(" ");

            var matches = total.match(/{(.+)}.{(.+)}.{(.+)}/i);

            if (matches.length > 3) {
                var statement = matches[1].trim();
                var trueCondition = matches[2].trim();
                var falseCondition = matches[3].trim();

                if (eval(statement)) {
                    mudjs.parseInput(trueCondition);
                } else {
                    mudjs.parseInput(falseCondition);
                }
            }
        }
    };

    return cmd_if;

}());

module.exports = cmd_if;

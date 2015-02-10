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
            var matches = total.match(/(\{[^{}]*\}).*(\{[^{}]*\})/i);

            if (matches && matches.length > 2) {
                var statement = mudjs.removeBlocks(matches[1]);
                var falseCondition = mudjs.removeBlocks(matches[2]);
                var trueCondition = matches[0].trim().replace('{' + statement + '}', '').replace('{' + falseCondition + '}');
                trueCondition = trueCondition.replace(/\{/i, '').substring(0, trueCondition.lastIndexOf('}') - 1).trim();

				console.log("statement: " + statement);
				console.log("on true: " + trueCondition);
				co
				
                // process procedures in statement
                statement = mudjs._procedures.process(mudjs, statement);

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

var cmd_substitute = (function() {
    'use strict';

    var cmd_substitute = {
        name: 'unsubstitute',
        description: 'Find/replace.',
        args: [
        {
            name: 'number',
            description: 'The of number of the sub to remove',
            optional: false
        }
        ],
        init: function(mudjs, args) {
            var i = Number(args[0]);
            var sub = mudjs._substitutes[i];

            if (sub) {
                mudjs._substitutes.splice(i, 1);
            }
        }
    };

    return cmd_substitute;

}());

module.exports = cmd_substitute;

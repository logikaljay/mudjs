var fs = require('fs');

var cmd_killgroup = (function() {
    'use strict';

    var cmd_killgroup = {
        name: 'killgroup',
        description: 'remove a script group from memory',
        args: [
        {
            name: 'name',
            description: 'The name of the group to remove',
            optional: false
        }
        ],
        init: function(mudjs, args) {
            var group = args[0];

            var triggersToKill = [];

            // make sure group exists
            if (group.length > 0) {
                // iterate over triggers
                for (var i = 0; i<= mudjs._triggers.length; i++) {
                    var trigger = mudjs._triggers[i];
                    if (trigger && trigger.group == group) {
                        mudjs._triggers.splice(i, 1);
                        i--;
                    }
                }
            }

        }
    };

    return cmd_killgroup;

}());

module.exports = cmd_killgroup;

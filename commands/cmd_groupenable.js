var cmd_groupenable = (function() {
    'use strict';

    var cmd_groupenable = {
        name: 'groupenable',
        description: 'Enables a script group',
        args: [{
            name: 'name',
            description: "name of the group to enable",
            optinal: false
        }],
        init: function(mudjs, args) {
            var group = args[0];

            // itreate over all triggers
            for (var i in mudjs._triggers) {
                var trigger = mudjs._triggers[i];

                if (trigger.group == args[0]) {
                    trigger.enabled = true;
                }
            }
        }
    };

    return cmd_groupenable;

}());

module.exports = cmd_groupenable;

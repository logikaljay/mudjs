var cmd_groupenable = (function() {
    'use strict';

    var cmd_groupenable = {
        name: 'name',
        description: 'Name of the group to enable',
        args: [],
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

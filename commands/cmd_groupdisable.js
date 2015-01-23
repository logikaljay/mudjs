var cmd_groupdisable = (function() {
    'use strict';

    var cmd_groupdisable = {
        name: 'name',
        description: 'Name of the group to disable',
        args: [],
        init: function(mudjs, args) {
            var group = args[0];

            // itreate over all triggers
            for (var i in mudjs._triggers) {
                var trigger = mudjs._triggers[i];

                if (trigger.group == args[0]) {
                    trigger.enabled = false;
                }
            }
        }
    };

    return cmd_groupdisable;

}());

module.exports = cmd_groupdisable;

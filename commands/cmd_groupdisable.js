var cmd_groupdisable = (function() {
    'use strict';

    var cmd_groupdisable = {
        name: 'name',
        description: 'Name of the group to disable',
        args: [],
        init: function(mudjs, args) {
            process.exit(0);
        }
    };

    return cmd_groupdisable;

}());

module.exports = cmd_groupdisable;

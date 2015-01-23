var cmd_groupenable = (function() {
    'use strict';

    var cmd_groupenable = {
        name: 'name',
        description: 'Name of the group to enable',
        args: [],
        init: function(mudjs, args) {
            process.exit(0);
        }
    };

    return cmd_groupenable;

}());

module.exports = cmd_groupenable;

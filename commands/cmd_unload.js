var cmd_unload = (function() {
    'use strict';

    var cmd_unload = {
        name: 'unload',
        description: 'Unload a plugin with given name',
        args: [
        {
            name: 'name',
            description: 'Name of the plugin to unload',
            optional: false
        }
        ],
        init: function(mudjs, args) {
            var plugin = args[0];

            if (mudjs._plugins && mudjs._plugins[plugin]) {
                mudjs._plugins[plugin].unload(mudjs);
                delete mudjs._plugins[plugin];
            }
        }
    };

    return cmd_unload;

}());

module.exports = cmd_unload;

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
            var pluginName = args[0];

            if (mudjs._plugins[pluginName]) {
                mudjs._plugins[pluginName].unload(mudjs);
                mudjs._plugins[pluginName] = null;
                for (var i=0;i<require.cache.length;i++) {

                }
                for (var key in require.cache) {
                    if (key.indexOf(pluginName + '.js') > -1) {
                        delete require.cache[key];
                    }
                }

            } else {
                mudjs.showme("Plugin " + pluginName + " not loaded. /load " + pluginName)
            }
        }
    };

    return cmd_unload;

}());

module.exports = cmd_unload;

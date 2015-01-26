var cmd_load = (function() {
    'use strict';

    var cmd_load = {
        name: 'load',
        description: 'Load a plugin with given name',
        args: [
        {
            name: 'name',
            description: 'Name of the plugin to load',
            optional: false
        }
        ],
        init: function(mudjs, args) {
            var pluginsDir = path.join(__dirname, 'plugins');
            if (!fs.existsSync(pluginsDir)) {
                pluginsDir = path.join(__dirname, '../', 'plugins');
            }

            fs.readdir(pluginsDir, function(err, files) {
                if (err) {
                    mudjs.showme('Could not read plugins directory: ' + err);
                    return;
                }
                if (!args[0]) {
                    mudjs.showme('Usage: /plugin [plugin name]');
                    return;
                }

                var pluginName = args[0];
                var foundPlugin = false;
                files.forEach(function(file) {
                    if (file.indexOf('.js') > -1) {
                        var baseFileName = file.split('.')[0];
                        if (baseFileName == pluginName) {
                            foundPlugin = true;
                        }
                    }
                });
                if (foundPlugin) {
                    if (mudjs._plugins.hasOwnProperty(pluginName)) {
                        mudjs._plugins[pluginName].unload();
                        mudjs._plugins[pluginName] = null;
                        for (var i=0;i<require.cache.length;i++) {

                        }
                        for (var key in require.cache) {
                            if (key.indexOf(pluginName + '.js') > -1) {
                                delete require.cache[key];
                            }
                        }
                    }

                    // attempt to load the plugin - don't crash if the user has a error
                    try {
                        var plugin = require(path.join(pluginsDir, pluginName + ".js"));
                        if (!plugin.hasOwnProperty('initialized') || !plugin.load || !plugin.unload) {
                            mudjs.showme('Could not load plugin: file does not appear to be a valid plugin');
                            return;
                        }
                        mudjs._plugins[pluginName] = plugin;
                        mudjs._plugins[pluginName].load(mudjs);
                    } catch (ex) {
                        mudjs.showme("Failed to load plugin '" + pluginName + "'");
                        mudjs.showme("Error: " + ex);
                    }

                } else {
                    mudjs.showme(pluginName + ' plugin not found');
                    return;
                }

            });
        }
    };

    return cmd_load;

}());

module.exports = cmd_load;

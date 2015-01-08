var cmd_load = (function() {
    'use strict';

    var cmd_load = {
        name: 'load',
        description: 'Load a saved profile.',
        args: [
            {
                name: 'profile',
                description: 'Name of the profile to load',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            var file = 'mudjs.default.json';

            if (args.length > 1) {
                file = 'mudjs.' + args[0] + '.json';
            }

            fs.readFile(file, function(err, data) {
                if (err) {
                    console.log('Could not open ' + file + ': ' + err);
                    return;
                }
                var config = JSON.parse(data);
                mudjs._triggers = config.triggers;
                mudjs._aliases = config.aliases;
            });
        }
    };

    return cmd_load;

}());

module.exports = cmd_load
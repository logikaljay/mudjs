var cmd_save = (function() {
    'use strict';

    var cmd_save = {
        name: 'save',
        description: 'Save the currently loaded profile.',
        args: [
            {
                name: 'profile',
                description: 'name of the profile to save',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            var file = 'mudjs.default.json';

            if (args.length > 1) {
                file = 'mudjs.' + args[0] + '.json';
            }

            var config = {
                triggers: mudjs._triggers,
                aliases: mudjs._aliases
            }

            fs.writeFile(file, JSON.stringify(config), function(err) {
                if (err) {
                    console.log('Could not save file: ' + err);
                } else {
                    console.log('Saved '+ file);
                }

            });
        }
    };

    return cmd_save;

}());

module.exports = cmd_save;
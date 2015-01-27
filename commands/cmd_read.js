var fs = require('fs');

var cmd_read = (function() {
    'use strict';

    var cmd_read = {
        name: 'read',
        description: 'read a script file into memory',
        args: [
            {
                name: 'file',
                description: 'The file to read',
                optional: true
            }
        ],
        init: function(mudjs, args) {
            var file = args[0];

            // make sure file has an extension
            if (file.indexOf('.mjs') == -1) {
                file = file + '.mjs';
            }

            // check if the file exists
            fs.exists(file, function(exists) {
                if (!exists) {
                    mudjs.showme('Cannot read ' + file + ": file does not exist");
                    return;
                }

                // read the file
                fs.readFile(file, function(err, data) {
                    var cmds = data.toString().split('\n');
                    cmds.forEach(function(cmd) {
                        // process the input
                        mudjs.parseInput(cmd);
                    });
                });
            });
        }
    };

    return cmd_read;

}());

module.exports = cmd_read;

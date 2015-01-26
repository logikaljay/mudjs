var util = require('util');

var proc_textcolor = (function() {
    'use strict';

    var proc_textcolor = {
        name: 'proc_textcolor',
        description: 'return the color of the text',
        args: [
        {
            name: 'color',
            description: 'The color to show',
            optional: false
        }
    ],
    init: function(mudjs, procedure, args) {
        var color = args[0].toLowerCase();

        // npm colors wasn't doing it for me.
        var styles = {
            //text colors
            'white'     : '\x1B[37m',
            'grey'      : '\x1B[90m',
            'black'     : '\x1B[30m',
            'blue'      : '\x1B[34m',
            'cyan'      : '\x1B[36m',
            'green'     : '\x1B[32m',
            'magenta'   : '\x1B[35m',
            'red'       : '\x1B[31m',
            'yellow'    : '\x1B[33m',
        };

        var input = args[0];
        for (var prop in styles) {
            if (input.indexOf(styles[prop]) > -1) {
                return prop;
            }
        }

        return "";
    }
};

return proc_textcolor;

}());

module.exports = proc_textcolor;

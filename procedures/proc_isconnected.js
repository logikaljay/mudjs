var util = require('util');

var proc_isconnected = (function() {
    'use strict';

    var proc_isconnected = {
        name: 'isconnected',
        description: 'Returns true if you are connected',
        args: [],
        init: function(mudjs, procedure, args) {
            return mudjs.connection !== undefined;
        }
    };

    return proc_isconnected;

}());

module.exports = proc_isconnected;

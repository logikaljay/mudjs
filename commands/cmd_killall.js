var fs = require('fs');

var cmd_killall = (function() {
    'use strict';

    var cmd_killall = {
        name: 'killall',
        description: 'removes all scripts from memory',
        args: [],
        init: function(mudjs, args) {
            var group = args[0];

            mudjs._triggers = [];
            mudjs._aliases = [];
            mudjs._vars = [];

            // iterate over _tickers, stopping each one
            for (var i = 0; i < mudjs._tickers.length; i++) {
                var ticker = mudjs._tickers[i].ticker;
                if (ticker !== undefined) {
                    clearInterval(ticker);
                }
            }

            mudjs._tickers = [];
        }
    };

    return cmd_killall;

}());

module.exports = cmd_killall;

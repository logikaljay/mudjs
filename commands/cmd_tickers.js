var util = require('util');

var cmd_tickers = (function() {
    'use strict';

    var cmd_tickers = {
        name: 'tickers',
        description: 'Lists all of the current running tickers',
        args: [],
        init: function(mudjs, args) {
            mudjs.showme("Tickers:");
            mudjs.showme("-------------------------");
            for (var i = 0; i < mudjs._tickers.length; i++) {
                var ticker = mudjs._tickers[i];
                if (ticker.enabled) {
                    mudjs.showme(util.format("%s - %s [%s]", i, ticker.command, ticker.group));
                } else {
                    // show the ticker in red
                    mudjs.showme('\x1B[31m' + util.format("%s - %s [%s]", i, ticker.command, ticker.group) + '\x1B[39m');
                }


            }
        }
    };

    return cmd_tickers;

}());

module.exports = cmd_tickers;

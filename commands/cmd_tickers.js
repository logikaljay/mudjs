var cmd_tickers = (function() {
    'use strict';

    var cmd_tickers = {
        name: 'tickers',
        description: 'Lists all of the current running tickers',
        args: [],
        init: function(mudjs, args) {
            if (args.length < 2) {
                mudjs.showme('Usage: /ticker [x] [command]')
                return;
            }

            var interval = parseInt(args.shift());
            var command = args.join(' ');

            var ticker = setInterval(
                function() {
                    mudjs.sendCommand(command);
                }, (interval * 1000)
            );

            mudjs._tickers.push(ticker);
        }
    };

    return cmd_tickers;

}());

module.exports = cmd_tickers;

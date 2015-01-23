var cmd_ticker = (function() {
    'use strict';

    var cmd_ticker = {
        name: 'ticker',
        description: 'Every X seconds, perform command',
        args: [
            {
                name: 'interval',
                description: 'Interval for the ticker to perform',
                optional: false
            },
            {
                name: 'command',
                description: 'Command to perform',
                optional: false
            }
        ],
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

    return cmd_ticker;

}());

module.exports = cmd_ticker;
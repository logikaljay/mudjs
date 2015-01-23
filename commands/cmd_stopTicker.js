var cmd_stopTicker = (function() {
    'use strict';

    var cmd_stopTicker = {
        name: 'stopTicker',
        description: 'Stops and clears the ticker',
        args: [
        {
            name: 'number',
            description: 'The number of the ticker to stop',
            optional: false
        }
        ],
        init: function(mudjs, args) {
            if (args.length < 1) {
                mudjs.showme('Usage: /stopTicker [#]')
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

    return cmd_stopTicker;

}());

module.exports = cmd_stopTicker;

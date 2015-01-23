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

            var i = Number(args[0]);

            if (i >= 0) {

                var interval = parseInt(args.shift());
                var command = args.join(' ');

                var ticker = mudjs._tickers[i].ticker;

                if (ticker !== undefined) {
                    clearInterval(ticker);
                    mudjs._tickers.splice(i, 1);
                } else {
                    mudjs.showme("Could not find ticker #" + i)
                }
            } else {
                mudjs.showme(i + " is not a number");
            }
        }
    };

    return cmd_stopTicker;

}());

module.exports = cmd_stopTicker;

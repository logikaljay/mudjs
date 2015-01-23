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
                mudjs.showme('Usage: /ticker {x} {command}')
                return;
            }

            var interval = 0;
            var command = "";
            var group = "";
            var enabled = true;

            var input = args.join(' ');
            var regex = /\{(.+)\}.\{(.+)\}.\{(.+)\}/i
            var matches = input.match(regex);
            if (matches && matches.length > 3) {
                interval = Number(matches[1]);
                command = matches[2];
                group = matches[3];
            } else {
                var regex = /\{(.+)\}.\{(.+)\}/i
                var matches = input.match(regex);
                if (matches && matches.length > 2) {
                    interval = Number(matches[1]);
                    command = matches[2];
                }
            }

            if (interval > 0) {
                var command = matches[2];

                var ticker = setInterval(
                    function() {
                        mudjs.parseInput(command);
                    }, (interval * 1000)
                );

                mudjs._tickers.push({
                    command: command,
                    interval: interval,
                    ticker: ticker,
                    enabled: enabled,
                    group: group });
            } else {
                mudjs.showme("interval was not a number.");
            }
        }
    };

    return cmd_ticker;

}());

module.exports = cmd_ticker;

var cmd_groupenable = (function() {
    'use strict';

    var cmd_groupenable = {
        name: 'groupenable',
        description: 'Enables a script group',
        args: [{
            name: 'name',
            description: "name of the group to enable",
            optinal: false
        }],
        init: function(mudjs, args) {
            var group = args[0];
            group = group.replace('{', '').replace('}', '');

            // itreate over all triggers
            for (var i in mudjs._triggers) {
                var trigger = mudjs._triggers[i];

                if (trigger.group == group) {
                    trigger.enabled = true;
                }
            }

            // iterate over all tickers
            for (var i in mudjs._tickers) {
                var ticker = mudjs._tickers[i];

                if (ticker.group == group) {
                    ticker.enabled = true;
                    ticker.ticker = setInterval(function() {
                        mudjs.parseInput(ticker.command)
                    }, ticker.interval * 1000);
                }
            }
        }
    };

    return cmd_groupenable;

}());

module.exports = cmd_groupenable;

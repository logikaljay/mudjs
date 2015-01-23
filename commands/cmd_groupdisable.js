var cmd_groupdisable = (function() {
    'use strict';

    var cmd_groupdisable = {
        name: 'groupdisable',
        description: 'Disable a script group',
        args: [{
            name: 'name',
            description: "name of the group to disable",
            optinal: false
        }],
        init: function(mudjs, args) {
            var group = args[0];
            group = group.replace('{', '').replace('}', '');

            // itreate over all triggers
            for (var i in mudjs._triggers) {
                var trigger = mudjs._triggers[i];

                if (trigger.group == group) {
                    trigger.enabled = false;
                }
            }

            // iterate over all tickers
            for (var i in mudjs._tickers) {
                var ticker = mudjs._tickers[i];

                if (ticker.group == group) {
                    ticker.enabled = false;
                    clearInterval(ticker.ticker);
                }
            }
        }
    };

    return cmd_groupdisable;

}());

module.exports = cmd_groupdisable;

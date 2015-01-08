var cmd_stopTicker = (function() {
    'use strict';

    var cmd_stopTicker = {
        name: 'stopTicker',
        description: 'Stops and clears the ticker',
        args: [
        {
            name: 'tickerName',
            description: 'Name of the ticker you want to stop',
            optional: false
        }],
        init: function(mudjs, args) {
            
        }
    };

    return cmd_stopTicker;

}());

module.exports = cmd_stopTicker;
var cmd_session = (function() {
    'use strict';

    var cmd_session = {
        name: 'session',
        description: 'Connect to a mud server',
        args: [
            {
                name: 'host',
                description: 'host name for the mud server',
                optional: false
            },
            {
                name: 'port',
                description: 'port that the mud server uses',
                optional: false
            }
        ],
        init: function(mudjs, args) {
            if (args.length < 2) {
                mudjs.showme('Usage: /session [host] [port]');
                return;
            }

            if (mudjs.connection === undefined || mudjs.conenction == null) {
                var host = args.shift();
                var port = parseInt(args.shift());
                mudjs.connect(host, port);
            } else {
                mudjs.showme("A session is already active");
            }
        }
    };

    return cmd_session;

}());

module.exports = cmd_session;

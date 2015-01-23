var cmd_triggers = (function() {
    'use strict';

    var cmd_triggers = {
        name: 'triggers',
        description: 'Execute a command when trigger occurs.',
        args: [],
        init: function(mudjs, args) {
            if (args.length === 0) {
                if (mudjs._triggers.length === 0) {
                    mudjs.showme('No active triggers');
                    return;
                }
                mudjs.showme('Active triggers: ');
                mudjs._triggers.forEach(function(trig) {
                    if (trig.enabled) {
                        mudjs.showme('"' + trig.trigger + '": ' + trig.command + ' ['+trig.group+']');
                    } else {
                        // show the trigger in red
                        mudjs.showme('\x1B[31m' + '"' + trig.trigger + '": ' + trig.command + ' ['+trig.group+']' + '\x1B[39m');
                    }
                });
                return;
            }
        }
    };

    return cmd_triggers;

}());

module.exports = cmd_triggers;

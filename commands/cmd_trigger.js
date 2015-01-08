var cmd_trigger = (function() {
    'use strict';

    var cmd_trigger = {
        name: 'trigger',
        description: 'Execute a command when trigger occurs.',
        args: [
            {
                name: 'trigger',
                description: 'RegExp expression of what to catch',
                optional: false
            },
            {
                name: 'command',
                description: 'command that gets run when RegExp matches',
                optional: false
            }
        ],
        init: function(mudjs, args) {
            if (args.length === 0) {
                if (mudjs._triggers.length === 0) {
                    console.log('No active triggers');
                    return;
                }
                console.log('Active triggers: ');
                mudjs._triggers.forEach(function(trig) {
                    console.log('"' + trig.trigger + '": ' + trig.command);
                });
                return;
            }
            var args = args.join(' ');
            var regex = /\{(.+)\}\s*\{(.+)\}/i;

            var matches = args.match(regex);

            if (matches && matches.length > 2) {
                // Replace %0, %1 etc with (.+)
                var trigger = matches[1].trim().replace(/\%[0-99]/i,'(.+)');

                var command = matches[2].trim();

                mudjs._triggers.push({ trigger: trigger, command: command });

                console.log('Trigger added. `' + command + '` will be executed when the text `' + trigger +'` appears')
            } else {
                console.log('Invalid trigger.')
                console.log('Format: /trigger { My Trigger Text } { My Trigger Result }');
            }
        }
    };

    return cmd_trigger;

}());

module.exports = cmd_trigger;
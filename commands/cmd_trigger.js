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
                    mudjs.showme('No active triggers');
                    return;
                }
                mudjs.showme('Active triggers: ');
                mudjs._triggers.forEach(function(trig) {
                    mudjs.showme('"' + trig.trigger + '": ' + trig.command);
                });
                return;
            }
            var args = args.join(' ');
            var regex = /\{(.+)\}\s*\{(.+)\}/i;

            var matches = args.match(regex);

            if (matches && matches.length > 2) {
                // Replace %0, %1 etc with (.+)
                var trigger = matches[1].trim().replace(/\%[0-99]/gi,'(.+)');
                console.log(trigger);
                var command = matches[2].trim();

                mudjs._triggers.push({ trigger: trigger, command: command });

                mudjs.showme('Trigger added. `' + command + '` will be executed when the text `' + trigger +'` appears')
            } else {
                mudjs.showme('Invalid trigger.')
                mudjs.showme('Format: /trigger { My Trigger Text } { My Trigger Result }');
            }
        }
    };

    return cmd_trigger;

}());

module.exports = cmd_trigger;

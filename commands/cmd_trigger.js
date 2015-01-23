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
            }, {
                name: 'Group',
                description: 'Script group that the trigger belongs to',
                optional: true
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
                    if (trig.enabled) {
                        mudjs.showme('"' + trig.trigger + '": ' + trig.command + ' ['+trig.group+']');
                    } else {
                        // show the trigger in red
                        mudjs.showme('\x1B[31m' + '"' + trig.trigger + '": ' + trig.command + ' ['+trig.group+']' + '\x1B[39m');
                    }
                });
                return;
            }
            var args = args.join(' ');

            var regex = /\{(.+)\}\s*\{(.+)\}\s*\{(.+)\}/i;
            var matches = args.match(regex);
            if (matches && matches.length > 3) {
                // Replace %0, %1 etc with (.+)
                var trigger = matches[1].trim().replace(/\%[0-99]/gi,'(.+)');
                var command = matches[2].trim();
                var group = matches[3].trim();

                mudjs._triggers.push({ trigger: trigger, command: command, group: group, enabled: true });

                mudjs.showme('Trigger added. `' + command + '` will be executed when the text `' + trigger +'` appears')
                return;
            } else {
                var regex = /\{(.+)\}\s*\{(.+)\}/i;

                var matches = args.match(regex);

                if (matches && matches.length > 2) {
                    // Replace %0, %1 etc with (.+)
                    var trigger = matches[1].trim().replace(/\%[0-99]/gi,'(.+)');
                    var command = matches[2].trim();

                    mudjs._triggers.push({ trigger: trigger, command: command, group: "", enabled: true });

                    mudjs.showme('Trigger added. `' + command + '` will be executed when the text `' + trigger +'` appears')
                }

                return;
            }

            mudjs.showme('Invalid trigger.')
            mudjs.showme('Format: /trigger {My Trigger Text} {My Trigger Result} {Script group}');
        }
    };

    return cmd_trigger;

}());

module.exports = cmd_trigger;

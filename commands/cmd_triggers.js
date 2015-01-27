var Table = require('cli-table');

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
                        var table = new Table({
                            chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
                            style : {compact : true, 'padding-left' : 1},
                        });

                        table.push({ 'Trigger': [trig.trigger]});
                        table.push({ 'Command': [trig.command]});
                        table.push({ 'Group': [trig.group]});
                        mudjs.showme(table.toString());
                    } else {
                        // show the trigger in red
                        var table = new Table({
                            chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
                            style : {compact : true, 'padding-left' : 1},
                        });

                        table.push({ 'Trigger': [trig.trigger]});
                        table.push({ 'Command': [trig.command]});
                        table.push({ 'Group': [trig.group]});
                        table.push({ 'Disabled': [true]});
                        mudjs.showme(table.toString());
                    }
                });

                return;
            }
        }
    };

    return cmd_triggers;

}());

module.exports = cmd_triggers;

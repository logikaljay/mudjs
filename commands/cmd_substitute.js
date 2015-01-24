var cmd_substitute = (function() {
    'use strict';

    var cmd_substitute = {
        name: 'substitute',
        description: 'Find/replace.',
        args: [
        {
            name: 'find',
            description: 'The string to find',
            optional: true
        },
        {
            name: 'replace',
            description: 'The string to replace',
            optional: true
        }
        ],
        init: function(mudjs, args) {
            if (args.length == 0) {
                // list the subs
                mudjs.showme("Substitues:");
                mudjs.showme("-------------------------");
                for (var i = 0; i < mudjs._substitutes.length; i++) {
                    var sub = mudjs._substitutes[i];
                    if (sub.enabled) {
                        mudjs.showme(util.format("%s - %s = %s [%s]", i, sub.find, sub.replace, sub.group));
                    } else {
                        // show the ticker in red
                        mudjs.showme('\x1B[31m' + util.format("%s - %s = %s [%s]", i, sub.find, sub.replace, sub.group) + '\x1B[39m');
                    }
                }

                return;
            }

            var subs = mudjs._substitutes;

            var find = "";
            var replace = "";
            var group = "";
            var enabled = true;

            var args = args.join(' ');
            var regex = /\{(.+)\}\s*\{(.+)\}\s*\{(.+)\}/i;
            var matches = args.match(regex);

            if (matches && matches.length > 3) {
                find = matches[1];
                replace = matches[2];
                group = matches[3];
                enabled = true;
            } else {
                var regex = /\{(.+)\}\s*\{(.+)\}/i;
                var matches = args.match(regex);

                if (matches && matches.length > 2) {
                    find = matches[1];
                    replace = matches[2];
                    group = "";
                    enabled = true;
                }
            }

            if (find !== "" && replace !== "") {
                // add the sub
                mudjs._substitutes.push({
                    find: find,
                    replace: replace,
                    group: group,
                    enabled: enabled });
            }
        }
    };

    return cmd_substitute;

}());

module.exports = cmd_substitute;

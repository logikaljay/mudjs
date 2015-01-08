var fs = require('fs')
    os = require('os')
    path = require('path')
;

var commandsDir = "../commands";

// set up the module
var commands = exports = module.exports = {};
commands._cmds = [];
commands._lookup = [];

// load all of the commands in the commands directory
var files = fs.readdirSync(path.join(__dirname, commandsDir));
files.forEach(function(file) {
    var cmd = require(path.join(__dirname, commandsDir, file));
    commands._cmds.push(cmd);
    commands._lookup[cmd.name] = cmd;
});
console.log(commands._lookup);

/**
 * Run a command
 * @param  {string} the name of the command to run
 * @param  {Object} mudjs object that is sent to the command
 * @param  {Array}  array of arguments also sent to the command
 * @return {void}
 */
commands.run = function(name, mudjs, args) {
    var cmd = commands._lookup[name];
    if (cmd !== undefined) {
        cmd.init(mudjs, args);

        // break now - we don't want the command run twice
        return;
    }

    // loopup failed - find the first command with the cmd.name contains name.
    var matching = commands._cmds.filter(function(cmd) {
        return cmd.name.toLowerCase().indexOf(name) > -1;
    });

    if (matching.length > 0) {
        matching[0].init(mudjs, args);
    } else {
        console.log('Unknown command: ' + name);
    }
}
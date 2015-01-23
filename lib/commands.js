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

/**
 * Find a command by its name, or part of its name
 * @param  {String} name of the command
 * @return {Object} the command
 */
commands.find = function(name) {
    var cmd = commands._lookup[name];
    if (cmd !== undefined) {
        return cmd;
    }

    // loopup failed - find the first command with the cmd.name contains name.
    var matching = commands._cmds.filter(function(cmd) {
        return cmd.name.toLowerCase().indexOf(name) > -1;
    });

    if (matching.length > 0) {
        return matching[0];
    } else {
        mudjs.showme('Unknown command: ' + name);
    }
}

/**
 * Run a command
 * @param  {string} the name of the command to run
 * @param  {Object} mudjs object that is sent to the command
 * @param  {Array}  array of arguments also sent to the command
 * @return {void}
 */
commands.run = function(name, mudjs, args) {
    var cmd = this.find(name);
    if (cmd !== undefined) {
        cmd.init(mudjs, args);
    }
}

/**
 * Add a command
 * @param {String}    Name of the command to add
 * @param {String}    Description of the command to add
 * @param {Array}     Array of arguments to add
 * @param {Function}  Function to execute
 * @returns {Boolean} true if successful
 */
commands.add = function(name, description, args, fn) {
    // validate the command
    if (name == undefined 
        || description == undefined 
        || fn == undefined 
        || args == undefined) {
        var error = "";
        if (name == undefined) {
            error += "name ";
        }

        if (description == undefined) {
            error += "description ";
        }

        if (fn == undefined) {
            error += "function ";
        }

        if (args == undefined) {
            error += "arguments array";
        }

        mudjs.showme("Failed to add command: You must provide a %s", error)
        return false;
    }

    if (name == "" || description == "") {
        return false;
    }

    if (args.length > 0) {
        args.forEach(function(arg) {
            if (!arg.hasOwnProperty('name') 
                || !arg.hasOwnProperty('description') 
                || !arg.hasOwnProperty('optional')) {
                var error = "";

                if (!arg.hasOwnProperty('name')) {
                    error += "name ";
                }

                if (!arg.hasOwnProperty('description')) {
                    error += "description ";
                }

                if (!arg.hasOwnProperty('optional')) {
                    error += "optional"
                }

                mudjs.showme("Failed to add command\r\nArgument error: %s", error);

                return false;
            }
        })
    }

    // build our object
    var cmd = {
        name: name,
        description: description,
        args: args,
        init: fn
    };

    // add our object
    commands._cmds.push(cmd);
    commands._lookup[name] = cmd;

    return true;
}
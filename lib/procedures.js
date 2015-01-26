var fs = require('fs')
os = require('os')
path = require('path')
util = require('util')
;

var proceduresDir = "../procedures";

// set up the module
var procedures = exports = module.exports = {};
procedures._procedures = [];
procedures._lookup = [];

// load all of the commands in the commands directory
var files = fs.readdirSync(path.join(__dirname, proceduresDir));
files.forEach(function(file) {
    var proc = require(path.join(__dirname, proceduresDir, file));
    procedures._procedures.push(proc);
    procedures._lookup[proc.name] = proc;
});

procedures.process = function(mudjs, input) {
    if (input === undefined) {
        return;
    }

    // find all procedures in input str
    var originalInput = input;
    for (var i = 0; i<3; i++) {
        var matches = originalInput.match(/%(\w+)\(([^()]+)\)/gi);
        if (matches == null) {
            return originalInput;
        }

        matches.forEach(function(match) {
            var matchArray = match.split('(');
            var key = matchArray.shift().replace('%', '');

            var args = matchArray.shift();
            args = args.substring(0, args.length - 1).split(" ");

            var proc = procedures.find(key);

            if (proc !== null) {
                var value = proc.init(mudjs, key, args);
                originalInput = originalInput.replace(match, value);
            } else {
                originalInput.replace(key, "");
            }
        })
    }

    return originalInput;
}

procedures.find = function(name) {
    var proc = procedures._lookup[name];
    if (proc !== undefined) {
        return proc;
    }

    // loopup failed - find the first command with the cmd.name contains name.
    var matching = procedures._procedures.filter(function(proc) {
        return proc.name.toLowerCase().indexOf(name) > -1;
    });

    if (matching.length > 0) {
        return matching[0];
    } else {
        return null;
    }
}

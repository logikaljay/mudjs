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
    // find all procedures in input str
    var originalInput = input;

    // procedure format: %name(arg1 arg2)
    var replacements = [];

    var matches = input.match(/%(\w*)\(([a-zA-Z0-9+\-\/*\ ]*)\)/gi);

    // iterate over matches - attempting to forfill their hopes and dreams
    matches.forEach(function(match) {
        var matchArray = match.split('(');

        var key = matchArray.shift();
        key = key.substring(1, key.length);

        var args = matchArray.shift();
        args = args.substring(0, args.length - 1).split(" ");

        var proc = procedures.find(key);
        if (proc !== null) {
            var value = proc.init(mudjs, key, args);
            replacements.push({key: match, value: value});
        }

    });

    replacements.forEach(function(r) {
        originalInput = originalInput.replace(r.key, r.value);
    });

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

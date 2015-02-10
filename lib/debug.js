var util = require('util'),
	fs = require('fs'),
	path = require('path'),
	colors = require('colors');

// register the module
var debug = exports = module.exports = {};
debug._file = path.join(__dirname, 'debug.log');
debug.enabled = false;

// check if the log file exists
debug.init = function(mudjs) {
	mudjs.showme("** Debug mode activated **".bold.yellow);
	mudjs.showme("** Writing to log file: ".yellow + this._file.yellow + " **".yellow );
	fs.writeFile(this._file, '', function(err) {
		debug.enabled = true;
	});
}

// set up some debugging functions
debug.write = function(str) {
	if (!debug.enabled) {
		return;
	}
	
	fs.appendFile(this._file, str + '\n', function(err) {
	});
}
var cmd_help = (function() {
    'use strict';

var cmd_help = {
    name: 'help',
    description: 'List all of the commands and show help',
    args: [
        {
            name: 'command',
            description: 'show help for a specific command',
            optional: true
        }
    ],
    init: function(mudjs, args) {
        console.log(
            'MudJS by Andy Baird' + os.EOL +
            '-------------------' + os.EOL +
            '/session [host] [port] - Connect to a MUD.' + os.EOL +
            '/save [profile] - Save the currently loaded profile. '  + os.EOL +
            '/load [profile] - Load a saved profile.' + os.EOL +
            '/alias { [alias name } { [alias command } - Create an alias for a command.' + os.EOL +
            '/trigger { [trigger] } { [reaction] } - Execute reaction when trigger occurs. JavaScript RegExp compatible' + os.EOL +
            '/echo [ text ] - Echo text back to the screen' + os.EOL,
            '/r [ X ] [ command ] - Repeat command X times' + os.EOL,
            '/ticker [ X ] [ command ] - Every X seconds, perform command' + os.EOL,
            '/plugin [ plugin name ] - Load a plugin with given name' + os.EOL,
            '/clear - Clear the screen' + os.EOL
            );
        }
    };

    return cmd_help
}());

module.exports = cmd_help;
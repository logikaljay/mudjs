var cmd_clear = (function() {

    var cmd_clear = {
        name: 'clear',
        description: 'Clear the screen',
        args: [],
        init: function(mudjs, args) {
            process.stdout.write("\033[2J\033[0f");
        }
    };

    return cmd_clear;

}());

module.exports = cmd_clear;
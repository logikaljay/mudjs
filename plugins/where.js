var where = exports = module.exports = {};
where.initialized = false;
where.running = false;
where.lb = '%color(bold)%color(yellow)[%color(cyan)';
where.rb = '%color(yellow)]%color(white)';
where.prefix = where.lb + 'WHERE' + where.rb;
where.mudjs;
where.list = [];
where.seen = [];
where.timer;
where.clearTimer;

where.load = function(mudjs) {
    where.initialized = true;
    where.mudjs = mudjs;

    mudjs._commands.add(
        'wherestart',
        'start watching where',
        [],
        function(mudjs, args) {
            where.start(mudjs);
        }
    );

    mudjs._commands.add(
        'wherestop',
        'stop watching where',
        [],
        function(mudjs, args) {
            where.stop(mudjs);
        }
    )

    this._show("Plugin loaded\r\n\t/wherestart | /wherestop");
}

where.unload = function(mudjs) {
    where.initialized = false;
    mudjs._commands.remove('wherestart');
    mudjs._commands.remove('wherestop');

    where.stop(mudjs);
    this._show("Plugin unloaded");
}

where._show = function(str) {
    // process procedures
    str = mudjs._procedures.process(mudjs, str);
    this.mudjs.showme(util.format("%s %s", this.prefix, str));
}

where.start = function(mudjs) {
    // start the listener
    where.running = true;
    mudjs.on('trigger', where.process);

    // start the interval
    if (!where.timer) {
        where.timer = setInterval(function() {
            where.mudjs.parseInput('page -none where');
        }, 8 * 1000);

        // show the start message
        where._show("started watching where");
    }
}

where.stop = function(mudjs) {
    // stop the listener
    where.running = false;
    mudjs.removeListener('trigger', where.process);

    // stop the interval
    if (where.timer) {
        clearInterval(where.timer);
        delete where.timer;

        // show the stop message
        where._show("stopped watching where");
    }
}

where.process = function(line) {
    // don't process anything if where is not running, or not initialized
    if (!where.running || !where.initialized) {
        return;
    }

    var watcher = /\[(\w+)(.+)\] - (.*)/i;
    var plainOutput = line.textOnly();
    if (watcher.test(plainOutput)) {
        var matches = plainOutput.match(watcher);
        var name = matches[1];
        var location = matches[3];
        where.seen.push(name);
        if (!where.list[name]) {
            where.list[name] = { name: name, location: location, appeared: new Date() };
            where._show(name + " %color(green)appeared%color(white) on where at %color(green)'" + location + "'");
        } else {
            var entity = where.list[name];
            if (entity.location !== location) {
                where._show(name + " %color(green)new location%color(white) => %color(green)'" + location + "'");
                entity.location = location;
            }
        }
    }

    if (!where.clearTimer && where.list.length > 0) {
        where.clearTimer = setTimeout(function() {
            var namesToRemove = [];
            // iterate over where.seen checking if they are in where.list (still on where)
            where.seen.forEach(function(name) {
                if (where.list.indexOf(name) == -1) {
                    // person has left where
                    where._show(name + " %color(green)disappeared%color(white)");
                    namesToRemove.push(name);
                }
            });

            // iterate over the name  taht have disappeared and remove them from the where list
            for (var i = 0; i < where.list.length; i++) {
                where.list.splice(i, 1);
                i--;
            }

            // iterate over the names that have disappeared and remove them from the seen list
            for (var i = 0; i < namesToRemove.length; i++) {
                namesToRemove.splice(i, 1);
                i--;
            }

            // clear where.list
        }, 200);
    }
}

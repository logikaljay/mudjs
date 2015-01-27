var list = exports = module.exports = {
    initialized: false,
    lists: [],
    mudjs: null,
    datafile: __dirname + '/../list.json',

};

var util = require('util');
var fs = require('fs');
var Table = require('cli-table');

list.load = function(mudjs) {
    list.mudjs = mudjs;

    list.loadCommands(function() {
        list._load();

        list.initialized = true;
    });
}

list.unload = function(mudjs) {
    list.initialized = false;
}

list.loadCommands = function(fn) {
    var mudjs = this.mudjs;

    mudjs._commands.add(
        'lists',
        'show all lists',
        [],
        function(mudjs, args) {
            list.list_show();
        }
    );

    mudjs._commands.add(
        'listitems',
        'show all list items',
        [{
            name: 'name',
            description: 'name of the list',
            optional: false
        }],
        function(mudjs, args) {
            list.list_show_items(args[0]);
        }
    );

    mudjs._commands.add(
        'listadd',
        'add a list',
        [{
            name: 'name',
            description: 'name of the list',
            optional: false
        }],
        function(mudjs, args) {
            list.list_add(args[0]);
        }
    );

    mudjs._commands.add(
        'listdel',
        'delete a list',
        [{
            name: 'name',
            description: 'name of the list',
            optional: false
        }],
        function(mudjs, args) {
            list.list_remove(args[0]);
        }
    );

    mudjs._commands.add(
        'listitemadd',
        'add a list item',
        [{
            name: 'list',
            description: 'name of the list',
            optional: false
        }, {
            name: 'name',
            description: 'name of the list item',
            optional: false
        }],
        function(mudjs, args) {
            list.list_item_add(args.shift(), args.join(" "));
        }
    );

    mudjs._commands.add(
        'listitemdel',
        'delete a list item',
        [{
            name: 'list',
            description: 'name of the list',
            optional: false
        }, {
            name: 'name',
            description: 'name of the list item',
            optional: false
        }],
        function(mudjs, args) {
            list.list_item_remove(args.shift(), args.join(" "));
        }
    )

    mudjs._commands.add(
        'temp',
        'temporary command',
        [],
        function(mudjs, args) {
            list._save();
        }
    );

    fn();
}

list.list_show = function() {
    // iterate over lists, showing each internal list
    var table = new Table({
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        style : {compact : true, 'padding-left' : 1},
        head: ['#', 'List name', 'Count'],
        colWidths: [5, 25, 25]
    });

    list.lists.forEach(function(l) {
        table.push(
            [ l.index, l.name, l.items.length ]
        );
    });

    this.mudjs.showme(table.toString());
}

list.list_show_items = function(id) {
    // iterate over listItems in list.lists, showing each item
    var table = new Table({
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        style : {compact : true, 'padding-left' : 1},
        head: ['#', 'List name', 'Item value'],
        colWidths: [5, 15, 35]
    });

    // get the list
    var tmp;

    if (isNaN(id)) {
        tmp = list.lists.filter(function(l) {
            return l.name == id;
        })[0];
    } else {
        tmp = list.lists[id];
    }

    for (var i = 0; i < tmp.items.length; i++) {
        table.push(
            [ i, tmp.name, tmp.items[i] ]
        );
    }

    this.mudjs.showme(table.toString());
}

list.list_add = function(id) {
    // add listName to list.lists;
    if (list.lists.hasOwnProperty(id) ) {
        this.mudjs.showme(id + " already exists");
        return;
    }

    list.lists.push({ name: id, items: [], index: list.lists.length });

    // reindex & save
    list._reindex();
    list._save();
}

list.list_remove = function(id) {
    var removed = false;

    // check if we are dealing with an index, or a name
    if (isNaN(id)) {
        // delete list item by name
        list.lists = list.lists.filter(function(l) {
            return l.name !== id;
        });

        removed = true;
    } else {
        list.lists.splice(id, 1);

        removed = true;
    }

    if (removed) {
        // re-index, save & bail
        list._reindex();
        list._save();
        return;
    }

    this.mudjs.showme(id + " does not exist");
}

list.list_item_add = function(id, listItemName) {
    // get the list
    var tmp;

    if (isNaN(id)) {
        tmp = list.lists.filter(function(l) {
            return l.name == id;
        })[0];
    } else {
        tmp = list.lists[id];
    }

    if (tmp) {
        tmp.items.push(listItemName);
        list._save();
    } else {
        this.mudjs.showme(id + " does not exist");
    }
}

list.list_item_remove = function(id, listItemId) {
    // get the list
    var tmp;

    if (isNaN(id)) {
        tmp = list.lists.filter(function(l) {
            return l.name == id;
        })[0];
    } else {
        tmp = list.lists[id];
    }

    if (tmp) {
        var removed = false;

        // try to remove the listItemId
        for (var i = 0; i < tmp.items.length; i++) {
            if (tmp.items[i] == listItemId) {
                tmp.items.splice(i, 1);
                removed = true;
                break;
            }
        }

        if (!removed) {
            if (!isNaN(listItemId)) {
                tmp.items.splice(listItemId, 1);
                removed = true;
            }
        }

        list._save();
    } else {
        this.mudjs.showme(id + " does not exist");
    }
}

list._reindex = function() {
    // re-index list.lists
    for (var i = 0; i < list.lists.length; i++) {
        list.lists[i].index = i;
    }
}

list._save = function() {
    // save list.lists
    var data = JSON.stringify(list.lists);
    fs.writeFile(list.datafile, data);
}

list._load = function() {
    // load list.lists
    fs.exists(list.datafile, function(exists) {
        if (!exists) {
            return;
        }

        fs.readFile(list.datafile, function(err, data) {
            var obj = JSON.parse(data);
            list.lists = obj;
        });
    });
}

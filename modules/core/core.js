module.exports = function(myApp){
    var core = {};
    var fs = require('fs');

    core.initialize = function(){
        // Say hello to everyone!
        myApp.utils.consoleOutput("line");
        myApp.utils.consoleOutput(myApp.package.name + " v"+myApp.package.version, "Center", true);
        myApp.utils.consoleOutput(myApp.package.author, "Center", true);
        if(myApp.package.description !== undefined){
            myApp.utils.consoleOutput(myApp.package.description, "Center", true);
        }
        myApp.utils.consoleOutput("line");

        // Start the initialization process
        myApp.utils.consoleOutput("Initializing...");

    //     fs.stat(myApp.root+'/config.json', function(err, stats) {
    //         if (err) {
    //             myApp.utils.consoleOutput("line");
    //             myApp.utils.consoleOutput("ERROR: config.json does not exist.", undefined, false);
    //             myApp.utils.consoleOutput("   Copy "+myApp.root+"/config.json.sample as config.json to resolve.", undefined, false);
    //             return;
    //         }
    //         core.finalize(myApp.root+'/config.json');
    //     });

    // };

    // core.finalize = function(config) {

        myApp.config = process.env;

        // Initialize the database
        // require("../database/sqlite3")(myApp);
        // myApp.database.initialize();

        // Initialize the storage
        require("../storage/memory")(myApp);
        require("../storage/redis")(myApp);
        myApp.storage.initialize();

        // Initialize the webserver
        require("../webserver/")(myApp);
        myApp.webserver.initialize();

        // Initialize the socket.io namespaces
        require("../sockets/livedraft")(myApp);
    };

    myApp.core = core;
};
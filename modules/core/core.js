module.exports = function(myApp){
    var core = {};
    //TODO: Test for ./config.json

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

        // Initialize the database
        // require("../database/sqlite3")(myApp);
        // myApp.database.initialize();

        // Initialize the webserver
        require("../webserver/")(myApp);
        myApp.webserver.initialize();

        // Initialize the socket.io namespaces
        require("../sockets/livedraft")(myApp);
    };

    myApp.core = core;
};
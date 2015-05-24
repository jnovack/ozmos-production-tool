module.exports = function(myApp){

    if (typeof myApp.storage !== "undefined") {
        myApp.utils.consoleOutput('module/storage/memory :: WARN :: storage '+myApp.storage.module+' already loaded.  module not loaded...');
        return;
    }

    var storage = { module: "memory" };
    var memory = {};

    storage.initialize = function(){

        myApp.utils.consoleOutput("module/storage/memory has been initialized...");
    };

    storage.get = function(field, callback, passthru) {
        if (typeof memory[field] !== "undefined") {
            callback(null, memory[field], passthru);
            return;
        }
        switch (field) {
            case "livedraft:solidjake":
                json = { theme: "solidjake", wsurl: "http://ws-drafttool.stormcraft.com" };
                callback(null, json, passthru);
                break;
            default:
                json = { theme: "default", wsurl: "http://localhost:8000" };
                callback(null, json, passthru);
        }
    };

    storage.set = function(field, data, callback, passthru) {
        memory[field] = data;
        if (typeof callback == "function") {
            callback(null, true, passthru);
        }
    };

    myApp.storage = storage;
    myApp.utils.consoleOutput("module/storage/memory has been loaded...");
};
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

    storage.get = function(field, callback) {
        if (typeof memory[field] !== "undefined") {
            callback(null, memory[field]);
            return;
        }
        switch (field) {
            case "livedraft:solidjake":
                json = { theme: "solidjake", wsurl: "http://ws-drafttool.stormcraft.com" };
                callback(null, json);
                break;
            default:
                json = { theme: "default", wsurl: "http://localhost:8000" };
                callback(null, json);
        }
    };

    storage.set = function(field, data, callback) {
        memory[field] = data;
        if (typeof callback == "function") {
            callback(null, true);
        }
    };

    myApp.storage = storage;
    myApp.utils.consoleOutput("module/storage/memory has been loaded...");
};
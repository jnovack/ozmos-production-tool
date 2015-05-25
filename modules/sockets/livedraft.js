module.exports = function(myApp) {
    var nsp_draft = myApp.webserver.io.of('/livedraft');

    nsp_draft.on('connection', function(socket){
        myApp.utils.consoleOutput("module/sockets/livedraft :: INFO :: connection on socket.io/livedraft for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Slight obfuscation for clients
            if (typeof data === "string") { data = { room: data }; }

            if (socket.custom.room) {
              myApp.utils.consoleOutput("module/sockets/livedraft :: DBUG :: socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            socket.join(data.room);
            socket.custom.room = data.room;

            myApp.utils.consoleOutput("module/sockets/livedraft :: DBUG :: socket " + socket.id + " joined " + socket.custom.room);
            socket.emit('joined', socket.custom.room);

            if ((typeof data === "object") && (data.admin === true)) {
                myApp.utils.consoleOutput("module/sockets/livedraft :: INFO :: socket " + socket.id + " in " + socket.custom.room + " is admin");
                socket.custom.isAdmin = true;
            }

            myApp.storage.get(socket.custom.room, function(err, json) {
                json = myApp.utils.tryJSONParse(json);            // TODO Don't trust parsing.
                console.log("!! livedraft: onJoin get", json);
                if (json !== null) {
                    if (typeof json.settings !== "undefined") {
                        myApp.utils.each(json.settings, function(value) {
                            console.log("!! livedraft: onJoin get each: ", value);
                            socket.emit('setting', value);
                        });
                    }
                }
            });

        });

        socket.on('broadcast', function(message) {
            if (!socket.custom.isAdmin) {
                return;
            }
            if (message.event == "setting") {
                myApp.storage.get(socket.custom.room, makeGetCallback(socket.custom.room, message));
            }
            nsp_draft.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    makeGetCallback = function(id, message) {
        console.log("!! makeGetCallback", id, message);
        var passthru = { id: id, data: message };
        return function(err, json) {
            json = myApp.utils.tryJSONParse(json);    // TODO Don't trust parsing.
            if (typeof json.settings == "undefined") {
                json.settings = {};
            }
            json.settings[message.data.id] = message.data;
            console.log("!! makeGetCallback: passthru: ", passthru);
            console.log("!! makeGetCallback: json: ", json);
            myApp.storage.set(passthru.id, JSON.stringify(json));
        };
    };

    myApp.utils.consoleOutput("module/sockets/livedraft has been loaded...");
};
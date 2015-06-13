module.exports = function(myApp) {
    var nsp_messageboard = myApp.webserver.io.of('/messageboard');

    nsp_messageboard.on('connection', function(socket){
        myApp.utils.consoleOutput("module/sockets/messageboard :: INFO :: connection on socket.io/messageboard for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Slight obfuscation for clients
            if (typeof data === "string") { data = { room: data }; }

            if (socket.custom.room) {
              myApp.utils.consoleOutput("module/sockets/messageboard :: DBUG :: socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            socket.join(data.room);
            socket.custom.room = data.room;

            myApp.utils.consoleOutput("module/sockets/messageboard :: DBUG :: socket " + socket.id + " joined " + socket.custom.room);
            socket.emit('joined', socket.custom.room);

            if ((typeof data === "object") && (data.admin === true)) {
                myApp.utils.consoleOutput("module/sockets/messageboard :: INFO :: socket " + socket.id + " in " + socket.custom.room + " is admin");
                socket.custom.isAdmin = true;
            }

            myApp.storage.get(socket.custom.room, function(err, json) {
                json = myApp.utils.tryJSONParse(json);            // TODO Don't trust parsing.
                console.log("!! messageboard: onJoin get", json);
                if (json !== null) {
                    if (typeof json.setting !== "undefined") {
                        myApp.utils.each(json.setting, function(value) {
                            console.log("!! messageboard: onJoin get each: ", value);
                            socket.emit('setting', value);
                        });
                    }
                    if (typeof json.action !== "undefined") {
                        myApp.utils.each(json.action, function(value) {
                            console.log("!! messageboard: onJoin get each action: ", value);
                            socket.emit('action', value);
                        });
                    }
                }
            });

        });

        socket.on('broadcast', function(message) {
            if (!socket.custom.isAdmin) {
                return;
            }
            if (message.event != "reload") {
                myApp.storage.get(socket.custom.room, makeGetCallback(socket.custom.room, message));
            }
            nsp_messageboard.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    makeGetCallback = function(id, message) {
        console.log("!! makeGetCallback", id, message);
        var passthru = { id: id, data: message };
        return function(err, json) {
            json = myApp.utils.tryJSONParse(json);    // TODO Don't trust parsing.
            if (typeof json[message.event] == "undefined") {
                json[message.event] = {};
            }
            json[message.event][message.data.id] = message.data;
            console.log("!! makeGetCallback: passthru: ", passthru);
            console.log("!! makeGetCallback: json: ", json);
            myApp.storage.set(passthru.id, JSON.stringify(json));
        };
    };

    myApp.utils.consoleOutput("module/sockets/messageboard has been loaded...");
};
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

            // TODO: Send data for room to socket
        });

        socket.on('broadcast', function(message) {
            if (!socket.custom.isAdmin) {
                return;
            }
            nsp_draft.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    myApp.utils.consoleOutput("module/sockets/livedraft has been loaded...");
};
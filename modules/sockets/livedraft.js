module.exports = function(myApp) {
    var nsp_draft = myApp.webserver.io.of('/draft');
    nsp_draft.on('connection', function(socket){
        myApp.utils.consoleOutput("Connection on socket.io/draft for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Slight obfuscation for clients
            if (typeof data === "string") { data = { room: data }; }

            if (socket.custom.room) {
              console.log("socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            socket.join(data.room);
            socket.custom.room = data.room;

            console.log("socket " + socket.id + " joined " + socket.custom.room);
            socket.emit('joined', socket.custom.room);

            if ((typeof data === "object") && (data.admin === true)) {
                console.log("socket is admin");
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

    myApp.utils.consoleOutput("module/sockets/draft has been loaded...");
};
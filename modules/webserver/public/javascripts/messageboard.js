var socket = io(document.location.origin+'/messageboard');

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('connect', function() {
    console.log("socket.io - connected");
    socket.emit('join', 'messageboard:'+opt_id);
});

socket.on('hide-messages', function(data) {
    $("#mainview_body").fadeOut();
});

socket.on('show-messages', function(data) {
    $("#mainview_body").fadeIn();
});

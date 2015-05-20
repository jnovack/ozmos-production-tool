
var control = io(document.location.origin+'/livedraft');

/**** Control Functions *****/

control.on('connect', function() {
    control.emit('join', {room: 'livedraft', admin: true});
});

control.on('message', function(data) {
    switch (data.action) {
        case "connect":
            draftid = data.value;
            livedraftConnect();
            console.log("initiating connection to livedraft url");
            break;
        case "disconnect":
            livedraft.disconnect();
            console.log("administratively disconnected");
            break;
        case 'pause':
            console.log('videos paused');
            break;
        case 'play':
            console.log('videos resumed');
            break;
        default:
            console.log(data);
    }
});

/**** LiveDraft Functions ****/

livedraft.on('connect', function(data) {
    console.log("livedraft connected");
    $('#btnConnect').hide();
    $('#btnDisconnect').show();
});

livedraft.on('disconnect', function(data) {
    console.log("livedraft connected");
    $('#btnConnect').show();
    $('#btnDisconnect').hide();
});

function send(message) {
    control.emit('broadcast', message);
    console.log(message);
}

$('#url').blur(function() {
    result = $('#url').val().substr($('#url').val().lastIndexOf('/')+1);
    pattern = new RegExp(/[0-9]+/);
    if (pattern.test(result)) {
        $('[name=url').removeClass('has-error');
    } else {
        $('[name=url').removeClass('has-success').addClass('has-error');
    }
});

$('#btnConnect').click(function() {
    result = $('#url').val().substr($('#url').val().lastIndexOf('/')+1);
    pattern = new RegExp(/[0-9]+/);
    if (pattern.test(result)) {
        console.log(result);
        send({ event: 'message', data: { action: 'connect', value: result }});
    }
});

$('#btnDisonnect').click(function() {
    livedraft.disconnect();
});

$("#btnReload").click(function() {
    send({ event: 'reload' });
});


function updateValue(data) {
    console.log(data);
}
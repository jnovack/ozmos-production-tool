
var control = io(document.location.origin+'/livedraft');

control.on('connect', function() {
    control.emit('join', {room: 'livedraft', admin: true});
});

//TODO - Process config push from server

var classes_label = "label-primary label-default label-info label-success label-danger label-warning";

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

$("#btnReload").click(function() {
    send({ event: 'reload' });
});

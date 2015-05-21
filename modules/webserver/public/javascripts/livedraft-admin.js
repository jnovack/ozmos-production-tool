
var control = io(document.location.origin+'/livedraft');

/**** Control Functions *****/

control.on('connect', function() {
    console.log('(control) connected');
    control.emit('join', {room: 'livedraft', admin: true});
});


control.on('joined', function(data) {
    console.log('(control) joined ' + data);
});

control.on('message', function(data) {
    switch (data.action) {
        case "connect":
            draftid = data.value;
            livedraftConnect();
            console.log("initiating connection to livedraft " + draftid);
            break;
        case "disconnect":
            livedraftDisconnect();
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

function triggerConnect() {
    console.log("triggerConnect()");
    $('#btnConnect').hide();
    $('#btnDisconnect').show();
};

function triggerDisconnect() {
    console.log("triggerDisonnect()");
    $('#btnConnect').show();
    $('#btnDisconnect').hide();
};

function send(message) {
    control.emit('broadcast', message);
    console.log(message);
}

function updateStatus(status) { }

function draftOver() {
}

function updateTime(data) {
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];
    $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index+' .overlay-bg').removeClass('waiting').addClass('animated myturn');
    $('#time-pool').text(data.timer);
    $('#blue-pool').text(data.timer_bonus1);
    $('#red-pool').text(data.timer_bonus2);
}


function updateValue(data) {
        $('#'+data.id+'-icon').addClass('divimage-'+data.value);
        $('#'+data.id+'-hero').text(properName(data.value));
}


/**** Administrative Functions ****/

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
        send({ event: 'message', data: { action: 'connect', value: result }});
    }
});

$('#btnPause').click(function() {
    send({ event: 'message', data: { action: 'pause', value: true }});
    $(this).hide();
    $('#btnPlay').show();
});

$('#btnPlay').click(function() {
    send({ event: 'message', data: { action: 'play', value: true }});
    $(this).hide();
    $('#btnPause').show();
});


$('#btnDisconnect').click(function() {
    livedraftDisconnect();
    send({ event: 'message', data: { action: 'disconnect', value: true }});
});

$("#btnReload").click(function() {
    send({ event: 'reload' });
});

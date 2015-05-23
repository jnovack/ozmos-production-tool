
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
            $('[name=url').removeClass('has-error');
            $('#url').attr('disabled',true).addClass('disabled');
            $('[data-toggle="tooltip"]').tooltip();
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

function updateStatus(data) {
    switch (parseInt(data.status)) {
        case 0:
            $('#status').text('setting up draft...');
            break;
        case 1:
            $('#status').text('waiting for teams to ready up...');
            break;
        case 2:
            $('#status').text('bans...');
            break;
        case 3:
            $('#status').text('picks...');
            break;
    }
}

function draftOver() {
    $('#status').text('draft complete');
}

function updateTime(data) {
    $('#timer-pool').text(data.timer);
    $('#timer-blue').text(data.timer_bonus1);
    $('#timer-red').text(data.timer_bonus2);
}

function updateProgress(data) {
    // TODO Update clock to team pick
    // TODO Make current selection more appealing
    $.each($("[data-group='selections']"), function(i, val) {
        $(val).removeClass('has-success');
    });
    console.log("updateProgress()");
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];
    $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index).addClass('has-success');
}

function updateValue(data) {
    $('#'+data.id+'-icon').addClass('divimage-'+data.value);
    $('#'+data.id+'-hero').text(properName(data.value));
}


/**** Administrative Functions ****/

$('#url').focus(function () {
    $(this).select();
});

$('#url').blur(function() {
    result = $('#url').val().substr($('#url').val().lastIndexOf('/')+1);
    pattern = new RegExp(/[0-9]{5}/);
    if (pattern.test(result)) {
        $('[name=url').removeClass('has-error');
        $('#url').attr('disabled',true).addClass('disabled');
        $('[data-toggle="tooltip"]').tooltip();
        send({ event: 'message', data: { action: 'connect', value: result }});
    } else {
        $('[name=url').removeClass('has-success').addClass('has-error');
    }
});

/* Auto Connect */
/* $('#btnConnect').click(function() {
    result = $('#url').val().substr($('#url').val().lastIndexOf('/')+1);
    pattern = new RegExp(/[0-9]+/);
    if (pattern.test(result)) {
        send({ event: 'message', data: { action: 'connect', value: result }});
    }
});
*/

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
    // TODO Fix Reconnect
    send({ event: 'message', data: { action: 'disconnect', value: true }});
});

$("#btnReload").click(function() {
    $("[data-group='selections']").text("");
    location.reload();
    send({ event: 'reload' });
});

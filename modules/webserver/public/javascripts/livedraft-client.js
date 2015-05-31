var client = io(document.location.origin+'/livedraft');

client.on('connect', function(data) {
    console.log('(client) connected');
    client.emit('join', 'livedraft:'+id);
});

client.on('joined', function(data) {
    console.log('(client) joined ' + data);
});

client.on('state', function(data) {
    switch (data.id) {
        case "url":
            draftid = data.value;
            if (draftid !== null) {
                livedraftConnect(draftid);
                console.log("initiating connection to livedraft " + draftid);
            } else {
                livedraftDisconnect();
                console.log("administratively disconnected");
            }
            break;
        case 'videos':
            if (data.value !== 'pause') {
                $("[data-group='videos']").each(function (i, val) { document.getElementById($(val).attr('id')).play(); });
                console.log('videos playing');
            } else {
                $("[data-group='videos']").each(function (i, val) { document.getElementById($(val).attr('id')).pause(); });
                console.log('videos paused');
            }
            break;
        default:
            console.log(data);
    }
});

client.on('command', function(data) {
    switch (data.action) {
        case 'reload':
            location.reload();
            break;
        default:
            console.log(data);
    }
});

client.on('setting', function(data) {
    if (typeof data.value.class !== "undefined") {
        $.each(data.value.class, function(i, val) {
            $('#'+data.id).removeClass(function (index, css) {
                var regex = new RegExp("(^|\\s)" + i + "-\\S+");
                return (css.match (regex) || []).join(' ');
            })
            $('#'+data.id).addClass(i + "-" + val);
        });
    }
    if (typeof data.value.css !== "undefined") {
        console.log(data);
        $.each(data.value.css, function(i, val) {
            $('#'+data.id).css(i, val);
        });
    } else {
        console.log(data);
    }
});

function triggerConnect() {
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];

    for (var t = 1; t < 3; ++t) {
        for (var s = 2; s < 4; ++s) {
            for (var i = 1; i < 6; ++i) {
                $('#'+team[t]+'-'+stage[s]+i+' .overlay-bg').removeClass('animated myturn').addClass('waiting');
                $('#'+team[t]+'-'+stage[s]+i+' .overlay-hero').removeClass('animated').addClass('hide');
            }
        }
    }

    $('[data-group="videos"]').attr('src', '').removeClass(buildWildcardClass('video')).addClass('hide');
    $('.overlay-message').addClass('hide').removeClass('animated');

    $('#timer-pool').text('');
    $('#timer-blue').text('');
    $('#timer-red').text('');

    console.log("triggerConnect()");
}

function triggerDisconnect() {
    console.log("triggerDisconnect()");
}

function updateStatus(data) {
    console.log('updateStatus()', data.status);
    switch (parseInt(data.status)) {
        case 0:
            $('#timer-pool').html('<i class="fa fa-spin fa-gear"></i>');
            break;
        default:
            $('#timer-pool').html('');
    }
}

function updateProgress(data) {
    console.log("updateProgress()");
    $('.time-turn'+data.turn).removeClass('time-notactive');
    $('.time-turn'+parseInt(data.turn % 2 + 1)).addClass('time-notactive');
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];
    $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index+' .overlay-bg').removeClass('waiting').addClass('animated myturn');
}

function updateTime(data) {
    console.log("updateTime()", data);
    $('#timer-pool').text(data.timer);
    $('#timer-blue').html(data.timer_bonus1);
    $('#timer-red').html(data.timer_bonus2);
}

function draftOver() {
    $('.overlay-message').removeClass('hide').addClass('animated');
    $('#timer-pool').text('');
    $('#timer-blue').text('');
    $('#timer-red').text('');
}

function updateValue(data) {
    console.log(data);
    $('#'+data.id+'-video').attr('src', getHeroVideo(data.value)).removeClass('hide').addClass('video-'+ data.value + ' animated');
    $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
    $('#'+data.id+'-hero').text(properName(data.value));
}
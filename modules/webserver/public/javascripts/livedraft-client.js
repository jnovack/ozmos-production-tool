var client = io(document.location.origin+'/livedraft');

client.on('connect', function(data) {
    console.log('(client) connected');
    client.emit('join', 'livedraft');
});

client.on('joined', function(data) {
    console.log('(client) joined ' + data);
});

client.on('message', function(data) {
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
        case "background-image":
            console.log(data);
            $('#wrapper').css('background-image', "url('"+data.value+"')").css('background-color', '');
            // TODO Set background image on #wrapper important
            break;
        case "background-color":
            console.log(data);
            $('#wrapper').css('background-image', '').css('background-color', data.value);
            // TODO set background color #wrapper important
            break;
        case 'pause':
            $("[data-group='videos']").removeAttr('loop');
            console.log('videos paused');
            break;
        case 'play':
            // $("[data-group='videos']").attr('loop', true);
            // TODO FIX Looping by using .play()
            console.log('videos resumed');
            break;
        default:
            console.log(data);
    }
});

client.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

function triggerConnect() {
    console.log("triggerConnect()");
}

function triggerDisconnect() {
    console.log("triggerDisconnect()");
}

function updateStatus(status) { }

function updateProgress(data) {
    console.log("updateProgress()");
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];
    $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index+' .overlay-bg').removeClass('waiting').addClass('animated myturn');
}

function updateTime(data) {
    console.log("updateTime()");
    $('#timer-pool').text(data.timer);
    $('#timer-blue').text(data.timer_bonus1);
    $('#timer-red').text(data.timer_bonus2);
}

function draftOver() {
    $('.overlay-message').removeClass('hide').addClass('animated');
    $('#timer-pool').text('');
    $('#timer-blue').text('');
    $('#timer-red').text('');
}


function updateValue(data) {
        console.log(data);
        $('#'+data.id+'-video').attr('src', getHeroVideo(data.value)).removeClass('hide').addClass(data.value + ' animated');
        $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
        $('#'+data.id+'-hero').text(properName(data.value));
}
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
    console.log("triggerDisonnect()");
}


function updateStatus(status) { }

function updateTime(data) {
    console.log("updateTime():"  + data);
    var team = [null, "blue", "red"];
    var stage = [null, null, 'b', 'p'];
    $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index+' .overlay-bg').removeClass('waiting').addClass('animated myturn');
    $('#time-pool').text(data.timer);
    $('#blue-pool').text(data.timer_bonus1);
    $('#red-pool').text(data.timer_bonus2);
}

function draftOver() {
    $('.overlay-message').removeClass('hide').addClass('animated');
    $('#time-pool').text('');
    $('#blue-pool').text('');
    $('#red-pool').text('');
}


function updateValue(data) {
        console.log(data);
        $('#'+data.id+'-video').attr('src', '/assets/hero-videos/'+data.value+'.webm').attr('poster', '/assets/hero-videos/'+data.value+'.png').removeClass('hide').addClass(data.value + ' animated');

        /* Hero and Player Names */
        // $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
        // $('#'+data.id+' .overlay-player').removeClass('hide').addClass('animated');
        // $('#'+data.id+' .overlay-hero .overlay-text').text(data.value);

        /* Hero Names Only */
        $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
        $('#'+data.id+'-hero').text(properName(data.value));

        // if (typeof yourFunctionName == 'function') {
        //   animateSelection();
        // }
}
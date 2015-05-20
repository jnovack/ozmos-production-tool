var heroes = { bans1: [], bans2: [], picks1: [], picks2: [] };
var command = io(document.location.origin+'/livedraft');
var livedraft = io(false);
var draftid;

command.on('connect', function(data) {
    command.emit('join', 'livedraft');
});

command.on('joined', function(data) {
    console.log('(command) joined ' + data);
});

command.on('message', function(data) {
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
            $("[data-group='videos']").removeAttr('loop');
            console.log('videos paused');
            break;
        case 'play':
            $("[data-group='videos']").attr('loop', 'loop');
            console.log('videos resumed');
            break;
        default:
            console.log(data);
    }
});

command.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

function livedraftConnect() {
    livedraft = io(livedraft_url,{query:"draft_id="+draftid});
    livedraft.on('connect', function(data) {
        console.log("connected to livedraft "+draftid);
    });
    livedraft.on('draft_update', function(data){
        if (typeof data.heroes !== "undefined") {
            $('#time-pool').text(data.timer);
            $('#blue-pool').text(data.timer_bonus1);
            $('#red-pool').text(data.timer_bonus2);
            if (JSON.stringify(data.heroes) !== JSON.stringify(heroes)) {
                if (JSON.stringify(data.heroes.bans1) !== JSON.stringify(heroes.bans1)) {
                    $.each($(data.heroes.bans1).not(heroes.bans1), function(i, val) {
                        var num = data.heroes.bans1.indexOf(val)+1;
                        console.log("Team 1 Banned: " + num + " - " + translated[val] );
                        updateValue({ id: 'blue-b'+num, value: translated[val] });
                    });
                }
                if (JSON.stringify(data.heroes.bans2) !== JSON.stringify(heroes.bans2)) {
                    $.each($(data.heroes.bans2).not(heroes.bans2), function(i, val) {
                        var num = data.heroes.bans2.indexOf(val)+1;
                        console.log("Team 2 Banned: " + num + " - " + translated[val] );
                        updateValue({ id: 'red-b'+num, value: translated[val] });
                    });
                }
                if (JSON.stringify(data.heroes.picks1) !== JSON.stringify(heroes.picks1)) {
                    $.each($(data.heroes.picks1).not(heroes.picks1), function(i, val) {
                        var num = data.heroes.picks1.indexOf(val)+1;
                        console.log("Team 1 Picked: " + num + " - " + translated[val] );
                        updateValue({ id: 'blue-p'+num, value: translated[val] });
                    });
                }
                if (JSON.stringify(data.heroes.picks2) !== JSON.stringify(heroes.picks2)) {
                    $.each($(data.heroes.picks2).not(heroes.picks2), function(i, val) {
                        var num = data.heroes.picks2.indexOf(val)+1;
                        console.log("Team 2 Picked: " + num + " - " + translated[val] );
                        updateValue({ id: 'red-p'+num, value: translated[val] });
                    });
                }
                console.log(data);
                heroes = data.heroes;
                var team = [null, "blue", "red"];
                var stage = [null, null, 'b', 'p'];
                $('#'+team[data.turn]+'-'+stage[data.status]+data.turn_index+' .overlay-bg').removeClass('waiting').addClass('animated myturn');
                $('#time-pool').text(data.timer);
                $('#blue-pool').text(data.timer_bonus1);
                $('#red-pool').text(data.timer_bonus2);
            }
        } else {
            console.log(data);
        }
        if ((data.status === 3) && (data.done === 1)) {
            $('#time-pool').text(0);
            $('#blue-pool').text(0);
            $('#red-pool').text(0);
            console.log("draft over");
        }
    });
}


var translated = {
    383: 'abathur',
    345: 'anubarak',
    367: 'arthas',
    343: 'azmodan',
    347: 'brightwing',
    355: 'chen',
    375: 'diablo',
    385: 'etc',
    387: 'falstad',
    379: 'gazlowe',
    377: 'illidan',
    341: 'jaina',
    415: 'kaelthas',
    339: 'kerrigan',
    357: 'lili',
    407: 'the-lost-vikings',
    381: 'malfurion',
    349: 'muradin',
    359: 'murky',
    373: 'nazeebo',
    389: 'nova',
    369: 'raynor',
    363: 'rehgar',
    391: 'sgt-hammer',
    393: 'sonya',
    395: 'stitches',
    413: 'sylvanas',
    365: 'tassadar',
    403: 'thrall',
    351: 'tychus',
    353: 'tyrael',
    397: 'tyrande',
    399: 'uther',
    371: 'valla',
    361: 'zagara',
    401: 'zeratul'
    };

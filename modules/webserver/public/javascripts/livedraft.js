var heroes = { bans1: [], bans2: [], picks1: [], picks2: [] };
var livedraft = null;
var draftid;
var status = -1;

/* Status 1 { mode: "pre", ready1: 1, ready2: 0, status: 1, timer1: 118, timer1_percent: 98, timer2: -1 } */

function livedraftConnect() {
    livedraft = io(livedraft_url,{query:"draft_id="+draftid});
    livedraft.on('connect', function(data) {
        triggerConnect();
        console.log("connected to livedraft "+draftid);
    });
    livedraft.on('disconnect', function() {
        triggerDisconnect();
        console.log("disconnected from livedraft");
    });
    livedraft.on('draft_update', function(data){
        if (data.status != status) {
            status = data.status;
            updateStatus(data);
        }
        if (status == 1) {
            if (data.timer1 > 0) {
                data.timer = data.timer1;
                data.timer1_bonus = 'READY';
                data.timer2_bonus = 'waiting';
            } else {
                data.timer = data.timer2;
                data.timer2_bonus = 'READY';
                data.timer1_bonus = 'waiting';
            }
        }
        if (typeof data.heroes !== "undefined") {
            if (JSON.stringify(data.heroes) !== JSON.stringify(heroes)) {
                if (JSON.stringify(data.heroes.bans1) !== JSON.stringify(heroes.bans1)) {
                    $.each($(data.heroes.bans1).not(heroes.bans1), function(i, val) {
                        var num = data.heroes.bans1.indexOf(val)+1;
                        console.log("Team 1 Banned: " + num + " - " + heroesArray[val] );
                        updateValue({ id: 'blue-b'+num, value: heroesArray[val] });
                    });
                }
                if (JSON.stringify(data.heroes.bans2) !== JSON.stringify(heroes.bans2)) {
                    $.each($(data.heroes.bans2).not(heroes.bans2), function(i, val) {
                        var num = data.heroes.bans2.indexOf(val)+1;
                        console.log("Team 2 Banned: " + num + " - " + heroesArray[val] );
                        updateValue({ id: 'red-b'+num, value: heroesArray[val] });
                    });
                }
                if (JSON.stringify(data.heroes.picks1) !== JSON.stringify(heroes.picks1)) {
                    $.each($(data.heroes.picks1).not(heroes.picks1), function(i, val) {
                        var num = data.heroes.picks1.indexOf(val)+1;
                        console.log("Team 1 Picked: " + num + " - " + heroesArray[val] );
                        updateValue({ id: 'blue-p'+num, value: heroesArray[val] });
                    });
                }
                if (JSON.stringify(data.heroes.picks2) !== JSON.stringify(heroes.picks2)) {
                    $.each($(data.heroes.picks2).not(heroes.picks2), function(i, val) {
                        var num = data.heroes.picks2.indexOf(val)+1;
                        console.log("Team 2 Picked: " + num + " - " + heroesArray[val] );
                        updateValue({ id: 'red-p'+num, value: heroesArray[val] });
                    });
                }
                console.log(data);
                updateProgress(data);
                heroes = data.heroes;
            }
            updateTime(data);
        } else {
            console.log(data);
        }
        if ((data.status === 3) && (data.done === 1)) {
            draftOver();
            console.log("draft over");
        }
    });
}


function livedraftDisconnect() {
    console.log("livedraftDisconnect()");
    // TODO Fix socket reconnection
    if (livedraft !== null) {
        location.reload();
    }
}

var heroesArray = {
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
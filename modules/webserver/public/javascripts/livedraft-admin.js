
var control = io(document.location.origin+'/livedraft');

var elements = {};

// TODO create a CSS customization like url and color

/**** Control Functions *****/

control.on('connect', function() {
    console.log('(control) connected');
    control.emit('join', {room: 'livedraft:'+id, admin: true});
});

control.on('joined', function(data) {
    console.log('(control) joined ' + data);
});

control.on('state', function(data) {
    switch (data.id) {
        case 'videos':
            if (data.value !== 'pause') {
                console.log('videos playing');
            } else {
                console.log('videos paused');
            }
            break;
        case "url":
            draftid = data.value;
            if (draftid !== null) {
                $('[name=url').removeClass('has-error');
                $('#url').attr('disabled',true).addClass('disabled');
                $('[data-toggle="tooltip"]').tooltip();
                draftid = data.value;
                livedraftConnect();
                console.log("initiating connection to livedraft " + draftid);
            } else {
                livedraftDisconnect();
                console.log("administratively disconnected");
            }
            break;
        default:
            console.log(data);
    }
});


control.on('command', function(data) {
    switch (data.action) {
        case 'reload':
            location.reload();
            break;
        default:
            console.log(data);
    }
});

control.on('setting', function(data){
    console.log(data);
    elements[data.id] = data.value;
    if (typeof data.value.class !== "undefined") {
        $.each(data.value.class, function(i, val) {
            // TODO This only works for one class, on one element. does not scale.
            $('.selectpicker').selectpicker('val', val);
        });
    }
    if (typeof data.value.options !== "undefined") {
        if (typeof data.value.options.radio !== "undefined") {
            if (data.value.options.radio.type == 'btn') {
                $('[data-group="'+data.value.options.radio.group+'"]').removeClass('btn-info').addClass('btn-primary');
                $('#'+data.value.options.radio.active).removeClass('btn-primary').addClass('btn-info');
            }
        }
        if (typeof data.value.options.saved !== "undefined") {
            $.each(data.value.options.saved, function(i, val) {
                $(document.getElementById(data.id+":"+i)).val(val);
            });
        }
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
    send({ event: 'state', data: { id: 'url', value: null }});
    $('#status').text('draft complete');
}

function updateTime(data) {
    $('#timer-pool').text(data.timer);
    $('#timer-blue').text(data.timer_bonus1);
    $('#timer-red').text(data.timer_bonus2);
}

function updateProgress(data) {
    // TODO Update clock to team pick
    $('#time-pool').parent().addClass('has-success');
    $('.time-turn'+data.turn).parent().addClass('has-success');
    $('.time-turn'+parseInt(data.turn % 2 + 1)).parent().removeClass('has-success');

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
        send({ event: 'state', data: { id: 'url', value: result }});
    } else {
        $('[name=url').removeClass('has-success').addClass('has-error');
    }
});

$('[data-group="draft-background-pills"]').click(function() {
    var clicked = this;
    var message = { event: 'setting', data: { id: 'wrapper',
                    value: {
                        css: {},
                        options: {
                            saved: {},
                            radio: {
                                'group': $(this).attr('data-group'),
                                'active': $(this).attr('id'),
                                'type': 'btn'
                            }
                        }
                    } } };

    for (var i = $('[data-group="draft-background-pills"]').length - 1; i >= 0; i--) {
        var obj = $('[data-group="draft-background-pills"]')[i];

        var action = $(obj).attr('data-action');
        var element = document.getElementById('wrapper:background-'+action);

        var value = transformData(obj);

        if (typeof value === "undefined") {
            $("[name='"+$(obj).attr('id')+"'").addClass('has-error');
            return;
        } else {
            $("[name='"+$(obj).attr('id')+"'").removeClass('has-error');
        }

        message.data.value.options.saved[$(obj).attr('id')] = $(obj).val();

        if (clicked === obj) {
            message.data.value.css[$(obj).attr('id')] = value;
        } else {
            message.data.value.css[$(obj).attr('id')] = '';
        }
    }

    if(typeof elements['wrapper'] !== "undefined") {
        $.extend(message.data.value, elements['wrapper']);
    }

    send(message);
});

function transformData(obj) {
    if ($(obj).val() == "") {
        $(obj).val( $(obj).attr('data-default') );
    }
    var retval = $(obj).val();
    switch ($(obj).attr('data-transform')) {
        case 'url':
            if (regex_url.test(retval)) {
                return "url('" + retval + "')";
            } else {
                return undefined;
            }
            break;
        case 'color':
            if (regex_color.test(retval)) {
                return retval;
            } else {
                return undefined;
            }
            break;
        default:
            return retval;
    }
}

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
    send({ event: 'state', data: { id: 'videos', value: 'pause' }});
    $(this).hide();
    $('#btnPlay').show();
});

$('#btnPlay').click(function() {
    send({ event: 'state', data: { id: 'videos', value: 'play' }});
    $(this).hide();
    $('#btnPause').show();
});

$('#btnDisconnect').click(function() {
    send({ event: 'state', data: { id: 'url', value: null }});
});

$("#btnReload").click(function() {
    $("[data-group='selections']").text("");
    send({ event: 'command', data: { action: 'reload' } });
});

/* document.ready(); */
$(function() {
    $('.selectpicker').selectpicker();
    // TODO This only works for one class, on one element. does not scale.
    $('.selectpicker').on('change', function(){
        var selected = $(this).find("option:selected").val();
        var build = { event: 'setting', data: { id: 'wrapper',
                    value: {
                        class: { 'theme': $(this).find("option:selected").val() }
                    } } };

        var message = $.extend(true, {}, build);
        if(typeof elements['wrapper'] !== "undefined") {
            $.extend(true, message.data.value, elements['wrapper']);
        }
        $.extend(true, message, build);

        send(message);
    });

    $('#livedraft').text(document.location.href.replace(/\/admin/g,''));

});

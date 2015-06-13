socket.on('connect', function() {
    socket.emit('join', {room: 'messageboard:'+opt_id, admin: true});
});

function send(message) {
    socket.emit('broadcast', message);
    console.log(message);
}

var classes_label = "label-primary label-default label-info label-success label-danger label-warning";

/*
 ***** Master Buttons *****
 */

$("#reloadButton").click(function() {
    send({ event: 'reload' });
});
$("#hideMsgButton").click(function() {
    message = { event: 'hide-messages' };
    send(message);
    $("#showMsgButton").show();
    $("#hideMsgButton").hide();
});
$("#showMsgButton").click(function() {
    message = { event: 'show-messages' };
    send(message);
    $("#hideMsgButton").show();
    $("#showMsgButton").hide();
});


/*
 ***** SubTitle *****
 */

$("#subtitleText").click(function() {
    message = { event: 'setting', data: { id: "subtitle1", text: $("#subtitle1").val() } };
    message = { event: 'setting', data: { id: "subtitle2", text: $("#subtitle2").val() } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().addClass("has-success");
    $("#subtitle2").parent().parent().addClass("has-success");
    send(message);
});
$("#subtitleAFKBreak").click(function() {
    message = { event: 'setting', data: { id: "subtitle1", text: "Away From Keyboard" } };
    message = { event: 'setting', data: { id: "subtitle2", text: "On Break" } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().removeClass("has-success");
    $("#subtitle2").parent().parent().removeClass("has-success");
    send(message);
});
$("#subtitleAFKCustom").click(function() {
    message = { event: 'setting', data: { id: "subtitle1", text: "Away From Keyboard" } };
    message = { event: 'setting', data: { id: "subtitle2", text: $("#subtitle2").val() } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().removeClass("has-success");
    $("#subtitle2").parent().parent().addClass("has-success");
    send(message);
});


/*
 ***** Toggle Pills *****
 */

$("[data-group='toggle-pills']").click(function() {
    var set = $(this).attr('data-set');
    var partner = $(this).attr('data-partner');
    var value = $(this).attr('data-value');
    var label = "success"

    if (partner == "Show") { label = "danger"; }

    message = { event: 'action', data: { id: set+'_container', action: 'ignore', value: value } };
    send(message);
    $("#"+set+partner).show();
    $(this).hide();
    $("#label-"+set).removeClass(classes_label).addClass("label-"+label);
});

/*
 ***** Voice *****
 */

$("input[data-automate='voice']").blur(function() {
    result = $(this).val();
    id = $(this).attr('id').replace('-text', '');
    if (result == "") {
        $('#' + id + '-picture option:selected').removeAttr('selected');
        $('#' + id + '-picture option[value="transparent"]').attr('selected', 'selected');
        $('#' + id + '-picture').change();
    } else {
        if ( $('#' + id + '-picture option:selected').text() == 'transparent') {
            $('#' + id + '-picture option:selected').removeAttr('selected');
            $('#' + id + '-picture option:eq(' + parseInt($('#' + id + '-text').val().toLowerCase(), 36) % $('#' + id + '-picture option').size() + ')').attr('selected', 'selected');
            $('#' + id + '-picture').change();
        }
    }
});

/*
 ***** Crawl *****
 */

$("#crawl-text").blur(function() {
    message = { event: 'setting', data: { id: "crawl-text", text: $("#crawl-text").val() } };
    send(message);
});

$("#crawlDisable").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-default");
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "hide" }});
});

$("#crawlBlack").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-primary");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-black" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

$("#crawlBlue").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-info");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-blue" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

$("#crawlRed").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-danger");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-red" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

/*
 ****** Selects and Inputs *****
 */

$("select").change(function() {
    message = { event: 'setting', data: { id: $(this).attr("data-for"), text: $("#" + $(this).attr("id") + " option:selected").text() } };
    send(message);
});

// Increment or decrement value fields with up/down arrows
$("input[data-group='value']").keydown( function( event ) {
    if ( event.which == 13 ) {
        event.preventDefault();
    }
    switch( event.keyCode ) {
        case 38: //up
            $(this).val(parseInt($(this).val())+1);
            break;
        case 40: //down
            $(this).val(parseInt($(this).val())-1);
            break;
    }
});

// Process input of value field
//   perform maths if needed
//   send if good input
$("input[data-group='value']").blur(function() {
    result = $(this).val();
    if (result.indexOf("/") > 0) {
        console.log(result);
        pattern = new RegExp(/[0-9]\//);
        if (pattern.test(result)) {
            result = parseInt(eval(result)*100);
            console.log(result);
        } else {
            return 0;
        }
    }
    if ($.isNumeric(parseInt(result))) {
        $(this).val(parseInt(result));
        message = { event: 'setting', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});


$("input[data-group='text']").blur(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 \'\"\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]]/);
    if (pattern.test(result) || result == "") {
        message = { event: 'setting', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});


socket.on('action', function(data) {
    console.log(data);

    if (data.action == 'ignore') {
        // Toggles
        $.each( $("[data-element='"+data.id+"']"), function(i, obj) {
            if ($(this).attr('data-value') == data.value) {
                var set = $(this).attr('data-set');
                var partner = $(obj).attr('data-partner');
                var label = "success"

                if (partner == "Show") { label = "danger"; }
                $("#"+set+partner).show();
                $(this).hide();
                $("#label-"+set).removeClass(classes_label).addClass("label-"+label);
            }
        });
    }
});


socket.on('setting', function(data) {
    console.log(data);

    // TODO crawl-text
    // TODO crawl-pills

    // Admin helper functions
    if (typeof $('#'+data.id).prop('type') !== "undefined") {
        switch ($('#'+data.id).prop('type')) {
            case "text":
                $("#"+data.id).val(data.text);
                break;
            case "textarea":
                $("#"+data.id).html(data.text);
                break;
            case "select-one":
                    $('#'+data.id + ' option[value=' + data.text + ']').prop('selected', true);
                break;
            default:
                console.log($('#'+data.id).prop('type'));
        }
    }

});

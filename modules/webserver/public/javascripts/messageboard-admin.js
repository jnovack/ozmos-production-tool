socket.on('connect', function() {
    socket.emit('join', {room: 'messageboard:'+opt_id, admin: true});
});

function send(message) {
    socket.emit('broadcast', message);
    console.log(message);
}


/*
 ***** Master Buttons *****
 */

$("#reloadButton").click(function() {
    send({ event: 'reload' });
});


/*
 ***** Radio Pills *****
 */
$("[data-group='radio-pills']").click(function() {
    var element = $(this).attr('data-element');
    var action = $(this).attr('data-action');
    var value = $(this).attr('data-value');

    if ($(this).attr('data-partner') !== null && $(this).attr('data-partner-active') !== null ) {
        $('#'+ $(this).attr('data-partner')).removeClass(buildWildcardClass($(this).attr('data-partner-inactive'))).addClass($(this).attr('data-partner-active'));
    }


    message = { event: 'action', data: { id: element, action: action, value: value } };
    send(message);
});


/*
 ***** Checkbox Pills *****
 */
$("[data-group='checkbox-pills']").click(function() {
    var element = $(this).attr('data-element');
    var action = $(this).attr('data-action');
    var activeText = $(this).attr('data-active-text');
    var inactiveText = $(this).attr('data-inactive-text');
    var value

    // Not sure why I have to do all this, the socket.on('action') should be taking care of it...
    if ($(this).hasClass('active')) {
        value = $(this).attr('data-unvalue');
        $(this).removeClass('active');
    } else {
        value = $(this).attr('data-value');
        $(this).addClass('active');
    }

    if ($(this).hasClass('active') && activeText !== null) {
        $(this).text(activeText);
        if ($(this).attr('data-partner') !== null && $(this).attr('data-partner-active') !== null ) {
            $('#'+ $(this).attr('data-partner')).removeClass($(this).attr('data-partner-inactive')).addClass($(this).attr('data-partner-active'));
        }
    } else if (!$(this).hasClass('active') && inactiveText !== null) {
        $(this).text(inactiveText);
        if ($(this).attr('data-partner') !== null && $(this).attr('data-partner-inactive') !== null ) {
            $('#'+ $(this).attr('data-partner')).removeClass($(this).attr('data-partner-active')).addClass($(this).attr('data-partner-inactive'));
        }
    }

    message = { event: 'action', data: { id: element, action: action, value: value } };
    send(message);
    $(this).blur();
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
        // Set a random picture based on the amount of images if no image was selected
        if ( $('#' + id + '-picture option:selected').text() == 'transparent') {
            $('#' + id + '-picture option:selected').removeAttr('selected');
            $('#' + id + '-picture option:eq(' + parseInt($('#' + id + '-text').val().toLowerCase(), 36) % $('#' + id + '-picture option').size() + ')').attr('selected', 'selected');
            $('#' + id + '-picture').change();
        }
    }
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

$("textarea[data-group='text']").blur(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 \'\"\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\;\:\,\.]/);
    if (pattern.test(result) || result == "") {
        message = { event: 'setting', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});

$("input[data-group='text']").blur(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 \'\"\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\;\:\,\.]/);
    if (pattern.test(result) || result == "") {
        message = { event: 'setting', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});

/*
 ***** socket.on Actions
 */
socket.on('action', function(data) {
    console.log(data);

    if (data.action == 'class' || data.action == 'ignore') {
        var element = $('[data-element="' + data.id + '"][data-action="' + data.action + '"]');

        switch ($(element[0]).attr('data-group')) {
            case "checkbox-pills":
                if (data.value == $(element[0]).attr('data-value')) {
                    $(element[0]).addClass('active');
                    if ($(element[0]).attr('data-active-text') !== null) {
                        $(element[0]).text($(element[0]).attr('data-active-text'));
                    }
                    if ($(element[0]).attr('data-partner') !== null && $(element[0]).attr('data-partner-active') !== null ) {
                        $('#'+ $(element[0]).attr('data-partner')).removeClass($(element[0]).attr('data-partner-inactive')).addClass($(element[0]).attr('data-partner-active'));
                    }
                } else if (data.value == $(element[0]).attr('data-unvalue')) {
                    $(element[0]).removeClass('active');
                    if ($(element[0]).attr('data-inactive-text') !== null) {
                        $(element[0]).text($(element[0]).attr('data-inactive-text'));
                    }
                    if ($(element[0]).attr('data-partner') !== null && $(element[0]).attr('data-partner-inactive') !== null ) {
                        $('#'+ $(element[0]).attr('data-partner')).removeClass($(element[0]).attr('data-partner-active')).addClass($(element[0]).attr('data-partner-inactive'));
                    }
                } else {
                    console.log('no clue how I got here... :/');
                }
                break;
            case "radio-pills":
                var element = $('[data-element="' + data.id + '"][data-action="' + data.action + '"][data-value="' + data.value + '"]');
                element.addClass('active');
                if (element.attr('data-partner') !== null && element.attr('data-partner-active') !== null ) {
                    $('#'+ element.attr('data-partner')).removeClass(buildWildcardClass(element.attr('data-partner-inactive'))).addClass(element.attr('data-partner-active'));
                }
                break;
            default:
                console.log('socket.on(action) switch case '+$(element[0]).attr('data-group')+' is NOT valid');
        }
    }

});

socket.on('setting', function(data) {
    console.log(data);

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

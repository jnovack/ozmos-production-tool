

// socket.on('connect', function() {
//     socket.emit('join', 'draft');
// });

// socket.on('value', function(data) {

// });

setTimeout( demo, 5000);

function demo() {
    updateValue({ id: 'blue-name', value: 'Cloud9 Maelstrom' });
    updateValue({ id: 'red-name', value: 'Tempo Storm' });
    var base = 3000;

    updateValue({ id: 'blue-p1-name', value: 'iDream' });
    updateValue({ id: 'blue-p2-name', value: 'DunkTrain' });
    updateValue({ id: 'blue-p3-name', value: 'k1pro' });
    updateValue({ id: 'blue-p4-name', value: 'King Caffiene' });
    updateValue({ id: 'blue-p5-name', value: 'Biceps' });
    updateValue({ id: 'red-p1-name',  value: 'Glaurung' });
    updateValue({ id: 'red-p2-name',  value: 'Kaeyoh' });
    updateValue({ id: 'red-p3-name',  value: 'Dreadnaught' });
    updateValue({ id: 'red-p4-name',  value: 'Sold1er' });
    updateValue({ id: 'red-p5-name',  value: 'Arthelon' });

    // $('#blue-b1 .overlay-bg').removeClass('waiting').addClass('animated myturn');
    // $('#blue-b1 .overlay-player').removeClass('hide').addClass('animated');
    setTimeout( function() { updateValue({ id: 'blue-b1',  value: 'uther' }); $('#red-b1 .overlay-bg').removeClass('waiting').addClass('animated myturn'); /* $('#red-b1 .overlay-player').removeClass('hide').addClass('animated'); */ }, base*1);
    setTimeout( function() { updateValue({ id: 'red-b1',   value: 'illidan' }); $('#blue-p1 .overlay-bg').removeClass('waiting').addClass('animated myturn'); },  base*2);
    setTimeout( function() { updateValue({ id: 'blue-p1',  value: 'the-lost-vikings' }); $('#red-p1 .overlay-bg').removeClass('waiting').addClass('animated myturn'); $('#red-p2 .overlay-bg').removeClass('waiting').addClass('animated myturn');}, base*3);
    setTimeout( function() { updateValue({ id: 'red-p1',   value: 'diablo' });  }, base*4);
    setTimeout( function() { updateValue({ id: 'red-p2',   value: 'sylvanas' }); $('#blue-p2 .overlay-bg').removeClass('waiting').addClass('animated myturn'); $('#blue-p3 .overlay-bg').removeClass('waiting').addClass('animated myturn'); }, base*5);
    setTimeout( function() { updateValue({ id: 'blue-p2',  value: 'tyrande' });  }, base*6);
    setTimeout( function() { updateValue({ id: 'blue-p3',  value: 'jaina' }); $('#red-p3 .overlay-bg').removeClass('waiting').addClass('animated myturn'); $('#red-p4 .overlay-bg').removeClass('waiting').addClass('animated myturn'); }, base*7);
    setTimeout( function() { updateValue({ id: 'red-p3',   value: 'rehgar' });  }, base*8);
    setTimeout( function() { updateValue({ id: 'red-p4',   value: 'zeratul' }); $('#blue-p4 .overlay-bg').removeClass('waiting').addClass('animated myturn'); $('#blue-p5 .overlay-bg').removeClass('waiting').addClass('animated myturn'); }, base*9);
    setTimeout( function() { updateValue({ id: 'blue-p4',  value: 'muradin' }); }, base*10);
    setTimeout( function() { updateValue({ id: 'blue-p5',  value: 'tassadar' }); $('#red-p5 .overlay-bg').removeClass('waiting').addClass('animated myturn'); }, base*11);
    setTimeout( function() { updateValue({ id: 'red-p5',   value: 'abathur' }); }, base*12);

    return true;
}
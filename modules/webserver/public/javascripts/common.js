
function properName(hero) {
    if (hero.indexOf('_') > 0) {
        hero = hero.substring(0, hero.indexOf('_'));
    }
    switch (hero) {
        case 'anubarak':
            return "Anub'arak";
            break;
        case 'etc':
            return "ETC";
            break;
        case 'kaelthas':
            return "Kael'thas";
            break;
        case 'lili':
            return "Li Li";
            break;
        case 'sgt-hammer':
            return "Sgt. Hammer";
            break;
        case 'the-lost-vikings':
            return "The Lost Vikings";
            break;
        default:
            return hero.charAt(0).toUpperCase()+hero.substr(1).toLowerCase();
    }
}

function updateValue(data) {

        $('#'+data.id+'-video').attr('src', '/assets/hero-videos/'+data.value+'.webm').attr('poster', '/assets/hero-videos/'+data.value+'.png').removeClass('hide').addClass(data.value + ' animated');

        /* Hero and Player Names */
        // $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
        // $('#'+data.id+' .overlay-player').removeClass('hide').addClass('animated');
        // $('#'+data.id+' .overlay-hero .overlay-text').text(data.value);

        /* Hero Names Only */
        $('#'+data.id+' .overlay-hero').removeClass('hide').addClass('animated');
        $('#'+data.id+' .overlay-hero .overlay-text').text(properName(data.value));

        // if (typeof yourFunctionName == 'function') {
        //   animateSelection();
        // }
}

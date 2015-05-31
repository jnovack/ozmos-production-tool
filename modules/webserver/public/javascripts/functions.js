var blizzard = {
    'abathur': 'http://media.blizzard.com/heroes/videos/heroes/skins/abathur_evolutionMaster.webm',
    'anubarak': 'http://media.blizzard.com/heroes/videos/heroes/skins/anubarak_traitorKing.webm',
    'arthas': 'http://media.blizzard.com/heroes/videos/heroes/skins/arthas_theLichKing.webm',
    'azmodan': 'http://media.blizzard.com/heroes/videos/heroes/skins/azmodan_lordOfSin.webm',
    'brightwing': 'http://media.blizzard.com/heroes/videos/heroes/skins/brightwing_faerieDragon.webm',
    'chen': 'http://media.blizzard.com/heroes/videos/heroes/skins/chen_legendaryBrewmaster.webm',
    'diablo': 'http://media.blizzard.com/heroes/videos/heroes/skins/diablo_lordOfTerror.webm',
    'etc': 'http://media.blizzard.com/heroes/videos/heroes/skins/etc_rockGod.webm',
    'falstad': 'http://media.blizzard.com/heroes/videos/heroes/skins/falstad_wildhammerThane.webm',
    'gazlowe': 'http://media.blizzard.com/heroes/videos/heroes/skins/gazlowe_bossOfRatchet.webm',
    'illidan': 'http://media.blizzard.com/heroes/videos/heroes/skins/illidan_theBetrayer.webm',
    'jaina': 'http://media.blizzard.com/heroes/videos/heroes/skins/jaina_archmage.webm',
    'kaelthas': 'http://media.blizzard.com/heroes/videos/heroes/skins/kaelthas_theSunKing.webm',
    'kerrigan': 'http://media.blizzard.com/heroes/videos/heroes/skins/kerrigan_queenOfBlades.webm',
    'lili': 'http://media.blizzard.com/heroes/videos/heroes/skins/lili_worldWanderer.webm',
    'malfurion': 'http://media.blizzard.com/heroes/videos/heroes/skins/malfurion_archdruid.webm',
    'muradin': 'http://media.blizzard.com/heroes/videos/heroes/skins/muradin_mountainKing.webm',
    'murky': 'http://media.blizzard.com/heroes/videos/heroes/skins/murky_babyMurloc.webm',
    'nazeebo': 'http://media.blizzard.com/heroes/videos/heroes/skins/nazeebo_hereticWitchDoctor.webm',
    'nova': 'http://media.blizzard.com/heroes/videos/heroes/skins/nova_dominionGhost.webm',
    'raynor': 'http://media.blizzard.com/heroes/videos/heroes/skins/raynor_renegadeCommander.webm',
    'rehgar': 'http://media.blizzard.com/heroes/videos/heroes/skins/rehgar_shamanOfTheEarthenRing.webm',
    'sgt-hammer': 'http://media.blizzard.com/heroes/videos/heroes/skins/sgt-hammer_siegeTankOperator.webm',
    'sonya': 'http://media.blizzard.com/heroes/videos/heroes/skins/sonya_wanderingBarbarian.webm',
    'stitches': 'http://media.blizzard.com/heroes/videos/heroes/skins/stitches_terrorOfDarkshire.webm',
    'sylvanas': 'http://media.blizzard.com/heroes/videos/heroes/skins/sylvanas_theBansheeQueen.webm',
    'tassadar': 'http://media.blizzard.com/heroes/videos/heroes/skins/tassadar_saviorOfTheTemplar.webm',
    'the-lost-vikings': 'http://media.blizzard.com/heroes/videos/heroes/skins/the-lost-vikings_tripleTrouble.webm',
    'thrall': 'http://media.blizzard.com/heroes/videos/heroes/skins/thrall_warchiefOfTheHorde.webm',
    'tychus': 'http://media.blizzard.com/heroes/videos/heroes/skins/tychus_notoriousOutlaw.webm',
    'tyrael': 'http://media.blizzard.com/heroes/videos/heroes/skins/tyrael_archangelOfJustice.webm',
    'tyrande': 'http://media.blizzard.com/heroes/videos/heroes/skins/tyrande_highPriestessOfElune.webm',
    'uther': 'http://media.blizzard.com/heroes/videos/heroes/skins/uther_theLightbringer.webm',
    'valla': 'http://media.blizzard.com/heroes/videos/heroes/skins/valla_demonHunter.webm',
    'zagara': 'http://media.blizzard.com/heroes/videos/heroes/skins/zagara_broodmotherOfTheSwarm.webm',
    'zeratul': 'http://media.blizzard.com/heroes/videos/heroes/skins/zeratul_darkPrelate.webm'
};

var regex_color = new RegExp(
   "(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)"
 );

var regex_url = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))*" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/\\S*)?" +
  "$", "i"
);

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

function getHeroVideo(hero) {
    // return "/assets/hero-videos/"+hero+".webm";

    return blizzard[hero];
}

function buildWildcardClass(prefix) {
  return function (index, css) {
    return (css.match (new RegExp("(^|\\s)" + prefix + "-\\S+", "g") ) || []).join(' ');
  }
}

// Catch ESC anywhere to blur the element, which should process the input
$(document).keyup(function(e) {
    if (e.keyCode == 27) { $(document.activeElement).blur(); }   // escape key maps to keycode `27`
});
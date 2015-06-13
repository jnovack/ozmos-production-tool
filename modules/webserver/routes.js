module.exports = function(app, myApp, express){

    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index.jade', { version: myApp.package.version } );
    });

    checkShortId = function(req, res, next) {
        if (!myApp.utils.isShortId(req.params.id)) {
            res.render('error.jade', { message: "not a valid id", error: { status: 404 } } );
        } else {
            next();
        }
    };

    /* MessageBoard */

    router.get('/messageboard/:id', checkShortId, function(req, res, next) {
        res.render('messageboard.jade', { id: req.params.id, title: "OPT: Heroes of the Storm - Message Board" } );
    });

    router.get('/messageboard/:id/admin', checkShortId, function(req, res, next) {
        res.render('messageboard-admin.jade', { id: req.params.id, admin: true, title: 'OPT: Messageboard Admin', created: req.flash('created') });
    });

    /* LiveDraft */

    router.get('/create/livedraft', function(req, res, next) {
        id = myApp.utils.shortid();
        req.flash('created', true);
        res.redirect('/livedraft/'+id+'/admin' );
    });

    router.get('/demo/livedraft', function(req, res, next) {
        // myApp.storage.get('livedraft:demo', function(err, config) {
            // if (err || myApp.utils.isEmpty(config) ) {
            //     config = { theme: "default", wsurl: "http://localhost:8000", settings: {} };
            //     myApp.storage.set('livedraft:'+req.params.id, config);
            // }
            res.render('livedraft.jade', { theme: 'default', layout: 'demo', wsurl: 'http://localhost:8000' } );
        // });
    });

    router.get('/livedraft/:id', checkShortId, function(req, res, next) {
        myApp.storage.get('livedraft:'+req.params.id, function(err, config) {
            if (err || myApp.utils.isEmpty(config) ) {
                config = { theme: "default", settings: {} };
                myApp.storage.set('livedraft:'+req.params.id, config);
            }
            console.log('/livedraft/:id ', typeof config, config);
            res.render('livedraft.jade', { id: req.params.id, theme: config.theme, layout: 'livedraft', wsurl: myApp.config.LIVEDRAFT_WEBSOCKET_URL } );
        });
    });

    router.get('/livedraft/:id/admin', checkShortId, function(req, res, next) {
        myApp.storage.get('livedraft:'+req.params.id, function(err, config) {
            if (err || myApp.utils.isEmpty(config) ) {
                config = { theme: "default", settings: {} };
                myApp.storage.set('livedraft:'+req.params.id, config);
            }
            res.render('livedraft-admin.jade', { id: req.params.id, wsurl: myApp.config.LIVEDRAFT_WEBSOCKET_URL, created: req.flash('created') });
        });
    });

    router.get('/livedraft/:id/preload', checkShortId, function(req, res, next) {
        res.render('preload.jade', { next: '/livedraft/'+req.params.id});
    });


    return router;
};
module.exports = function(app, myApp, express){

    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index.jade', { } );
    });

    // router.get('/livedraft/admin', function(req, res, next) {
    //     res.render('livedraft-admin.jade', { wsurl: myApp.config.livedraft.wsurl });
    // });

    // router.get('/livedraft/preload', function(req, res, next) {
    //     res.render('preload.jade', { next: '/livedraft'});
    // });

    // router.get('/livedraft/demo', function(req, res, next) {
    //     myApp.storage.get('livedraft:demo', function(err, config) {
    //         console.log("demo" + config);
    //         res.render('livedraft.jade', { theme: config.theme, layout: 'demo', wsurl: config.wsurl } );
    //     });
    // });


    /* LiveDraft */

    router.get('/livedraft/create', function(req, res, next) {
        id = myApp.utils.shortid();
        res.redirect('/livedraft/'+id );
    });

    checkShortId = function(req, res, next) {
        if (!myApp.utils.isShortId(req.params.id)) {
            res.render('error.jade', { message: "not a valid id", error: { status: 404 } } );
        } else {
            next();
        }
    };

    router.get('/livedraft/:id', checkShortId, function(req, res, next) {
        myApp.storage.get('livedraft:'+req.params.id, function(err, config) {
            if (err || myApp.utils.isEmpty(config) ) {
                config = { theme: "default", wsurl: "http://localhost:8000", settings: {} };
                myApp.storage.set('livedraft:'+req.params.id, config);
            }
            console.log('/livedraft/:id ', typeof config, config);
            res.render('livedraft.jade', { id: req.params.id, theme: config.theme, layout: 'livedraft', wsurl: config.wsurl } );
        });
    });

    router.get('/livedraft/:id/admin', checkShortId, function(req, res, next) {
        myApp.storage.get('livedraft:'+req.params.id, function(err, config) {
            if (err || myApp.utils.isEmpty(config) ) {
                config = { theme: "default", wsurl: "http://localhost:8000", settings: {} };
                myApp.storage.set('livedraft:'+req.params.id, config);
            }
            res.render('livedraft-admin.jade', { id: req.params.id, wsurl: config.wsurl });
        });
    });

    router.get('/livedraft/:id/preload', checkShortId, function(req, res, next) {
        res.render('preload.jade', { next: '/livedraft/'+req.params.id});
    });

    router.get('/livedraft/:id/demo', checkShortId, function(req, res, next) {
        myApp.storage.get('livedraft:demo', function(err, config) {
            if (err || myApp.utils.isEmpty(config) ) {
                config = { theme: "default", wsurl: "http://localhost:8000", settings: {} };
                myApp.storage.set('livedraft:'+req.params.id, config);
            }
            res.render('livedraft.jade', { theme: config.theme, layout: 'demo', wsurl: config.wsurl } );
        });
    });

    /*
    router.get('/create', function(req, res, next) {
        id = myApp.utils.shortid();
        admin = myApp.utils.shortid();
        blueteam = myApp.utils.shortid();
        redteam = myApp.utils.shortid();
        draftids = { id: id, admin: admin, blueteam: blueteam, redteam: redteam };

        myApp.database.create(draftids, function(data) {
            res.redirect('/draft/'+draftids.admin );
        });
    });

    router.get('/draft/:id', function(req, res, next) {
        myApp.database.find(req.params.id, function(data){
            if (typeof data === 'undefined') {
                res.render('error.jade', { message: "record not found", error: { status: 404 } } );
            } else {
                var view = data.view;
                myApp.database.get(data.draft, function(ret) {
                    vars = { meta: { success: true }, data: { id: ret.id, view: view, payload: ret.payload, created: ret.created, modified: ret.modified } };
                    if (view == 'admin') {
                        vars.data = ret;
                        ret.view = 'admin';
                        res.render('mockdraft/admin.jade', vars );
                    } else if (view == 'blueteam' || view == 'redteam') {
                        res.render('mockdraft/team.jade', vars );
                    } else {
                        res.render('livedraft.jade', vars );
                    }
                });
            }
        });
    });
    */

    return router;
};
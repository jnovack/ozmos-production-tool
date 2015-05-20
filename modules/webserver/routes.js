module.exports = function(app, myApp, express){

    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('draft.jade', { } );
    });

    router.get('/livedraft/', function(req, res, next) {
        res.render('draft.jade', { theme: myApp.config.livedraft.theme, layout: 'livedraft', wsurl: myApp.config.livedraft.wsurl } );
    });

    router.get('/livedraft/admin', function(req, res, next) {
        res.render('livedraft-admin.jade', { wsurl: myApp.config.livedraft.wsurl });
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
                        res.render('draft.jade', vars );
                    }
                });
            }
        });
    });
    */

    return router;
};
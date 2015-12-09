// PACKAGES //
router = require('express').Router();
path = require('path');
request = require('request');
utils = require('../utils');
Session = require('../models/Session');
User = require('../models/User');
Course = require('../models/Course');

/**
 * GET - /api/session
 * creates stash for session if user doesn't have one already
 */
router.get('/', function(req, res) {
    if (req.currentUser) {
        Session.findSession(req.query.sessionId, function(err, session) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                Stash.findBySessionAndUsername(session._id, req.currentUser, function(err, stash) {
                    if (err) {
                        Session.addStash(session._id, req.currentUser, function(err, stash) {
                            if (err) {
                                utils.sendErrResponse(res, 403, err);
                            }
                            else {
                                session.stash = stash;
                                utils.sendSuccessResponse(res, session);
                            }
                        });
                    } else {
                        session.stash = stash;
                        utils.sendSuccessResponse(res, session);
                    }
                });
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/session/visit
 */
router.post('/visit', function(req, res) {
    if (req.currentUser) {
        Session.findSession(req.body.sessionId, function(err, session) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                User.addRecentSession(req.currentUser, session._id, function(err, result) {
                    if (err) {
                        utils.sendErrResponse(res, 403, err);
                    }
                    else {
                        utils.sendSuccessResponse(res, result);
                    }
                });
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});


/**
 * POST - /api/session/create
 */
router.post('/create', function(req, res) {
    if (req.currentUser) {
        Course.addSession(req.body.number, req.body.title, req.currentUser, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/session/image
 */
router.post('/image', function(req, res) {
    if (req.currentUser) {
        request.post(
            "https://api.imgur.com/3/upload",
            {
                form: {type: 'base64', image: req.body.imageData, title: 'Upload by Notably'},
                headers: {'Authorization': "Client-ID " + process.env.IMGUR_API_KEY}
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    utils.sendSuccessResponse(res, {'link' : JSON.parse(body).data.link})
                } else {
                    utils.sendErrResponse(res, 403, 'Error uploading image');
                }
            }
        );
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});




module.exports = router;

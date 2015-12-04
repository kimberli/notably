// PACKAGES //
router = require('express').Router();
path = require('path');
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
        Session.findSession(req.query.sessionId, function(err,session) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                User.addRecentSession(req.currentUser, session._id, function(err, result) {
                    if (err) {
                        utils.sendErrResponse(res, 403, err);
                    }
                    else {
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
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/session/
 */
router.post('/', function(req, res) {
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

module.exports = router;

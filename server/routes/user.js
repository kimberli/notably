// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');
User = require('../models/User');

/**
 * Helper function to check whether the user request is valid
 */
var isValidUserReq = function(req, res) {
    if (req.currentUser) {
        utils.sendErrResponse(res, 403, 'There is already a user logged in.');
        return false;
    } else if (!req.body.username) {
        utils.sendErrResponse(res, 400, 'Username not provided.');
        return false;
    }
    return true;
};

/**
 * GET - /api/user
 */
router.get('/', function(req, res) {
    if (req.currentUser) {
        User.findProfile(req.body.username, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * GET - /api/user/courses
 */
router.get('/test', function(req, res) {
    utils.sendSuccessResponse(res, { hi: "kim"});
});

/**
 * POST - /api/user/create
 */
router.post('/create', function(req, res) {
    if (isValidUserReq(req, res)) {
        User.createNewUser(req.body.username, req.body.password, req.body.name, req.body.email, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { username: result.username });
            }
        });
    }
});

/**
 * POST - /api/user/login
 */
router.post('/login', function(req, res) {
    if (isValidUserReq(req, res)) {
        User.verifyPassword(req.body.username, req.body.password, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { username: req.body.username });
            }
        });
    }
});

/**
 * POST - /api/user/logout
 */
router.post('/logout', function(req, res) {
    if (req.currentUser) {
        var user = req.currentUser;
        req.session.destroy();
        utils.sendSuccessResponse(res, { username: user });
    } else {
        utils.sendErrResponse(res, 403, 'There is no user currently logged in.');
    }
});

/**
 * GET - /api/user/courses
 */
router.get('/courses', function(req, res) {
    if (req.currentUser) {
        User.getCourses(req.currentUser, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/user/subscribe
 */
router.put('/subscribe', function(req, res) {
    if (req.currentUser) {
        User.addCourse(req.currentUser, req.body.course, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

module.exports = router;

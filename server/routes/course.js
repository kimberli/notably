// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');
Course = require('../models/Course');

module.exports = router;

/**
 * GET - /api/course
 */
router.get('/', function(req, res) {
    if (req.currentUser) {
        Course.findCourse(req.body.number, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * GET - /api/course/all
 */
router.get('/all', function(req, res) {
    if (req.currentUser) {
        Course.getAllCourses(function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/course/newsession
 */
router.get('/newsession', function(req, res) {
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

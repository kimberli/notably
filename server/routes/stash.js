// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');
Stash = require('../models/Stash');

/**
 * GET - /api/stash
 */
router.get('/', function(req, res) {
    if (req.currentUser) {
        Stash.findByStashId(req.query.stashId, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/stash/save
 */
router.post('/save', function(req, res) {
    if (req.currentUser) {
        Stash.saveSnippet(req.body.snippetId, req.body.stashId, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

/**
 * POST - /api/stash/remove
 */
router.post('/remove', function(req, res) {
    if (req.currentUser) {
        Stash.removeSnippet(req.body.snippetId, req.body.stashId, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

module.exports = router;

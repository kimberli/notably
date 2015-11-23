// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');
Snippet = require('../models/Snippet');

/**
 * GET - /api/snippet
 */
router.get('/', function(req, res) {
    if (req.currentUser) {
        Snippet.findSnippet(req.query.snippetId, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, result);
            }
        });
    } else utils.sendErrResponse(res, 403, 'Must be logged in');
});

module.exports = router;

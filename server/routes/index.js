// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');

// VIEW ENDPOINT //
router.get('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/views/index.html'));
});

module.exports = router;

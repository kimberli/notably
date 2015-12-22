// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');

// VIEW ENDPOINTS //
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/views/index.html'));
});

router.get('/*', function(req, res, next) {
    if (req.currentUser) {
        res.sendFile(path.join(__dirname, '../../client/views/index.html'));
    } else {
        res.redirect('/');
    }
});


module.exports = router;

// PACKAGES //
router = require('express').Router();
path = require('path');

// VIEW ENDPOINTS //
router.get('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

module.exports = router;

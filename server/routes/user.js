// PACKAGES //
router = require('express').Router();
path = require('path');
utils = require('../utils');
User = require('../models/User');

// API ENDPOINTS //
router.post('/create', function(req, res) {
    utils.sendSuccessResponse(res, { username : "kim" });
});

module.exports = router;

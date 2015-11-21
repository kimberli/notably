module.exports = function () {
    var config = {};

    config.mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/notably';
    config.cookieSecret = 'secretmongoosequeries'

    return config;
}();

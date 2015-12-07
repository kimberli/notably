// PACKAGES //
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var helmet = require('helmet');
var csrfProtection = require('csurf')({ cookie: true }); // not used yet

// SERVER FILES //
var config = require('./config');

// ROUTE HANDLERS //
var index = require('./routes/index');
var user = require('./routes/user');
var course = require('./routes/course');
var session = require('./routes/session');
var stash = require('./routes/stash');
var snippet = require('./routes/snippet');

// APP //
var app = express();

// DATABASE //
mongoose.connect(config.mongoURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
});

// VIEW ENGINE //
app.set('view engine', 'html');
app.engine('html', function(path, options, callback) {
    fs.readFile(path, 'utf-8', callback);
});

// MIDDLEWARE //
app.use(morgan('dev')); // logger
app.use(express.static(__dirname + '/../client')); // set static folder
app.use(favicon(__dirname + '/../client/assets/img/favicon/favicon.ico')); // favicon
app.use(cookieSession({secret: config.cookieSecret}))
app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({ extended: true })); // parse forms
app.use(helmet()); // bunch of security stuff

// AUTH MIDDLEWARE //
app.use(function(req, res, next) {
    if (req.session.username) {
        User.auth(req.session.username, function(err, user) {
            if (user) {
                req.currentUser = user.username;
            } else {
                req.currentUser = undefined;
                req.session = null;
            }
            next();
        });
    } else next();
});

// ROUTES //
app.use('/api/user', user);
app.use('/api/course', course);
app.use('/api/session', session);
app.use('/api/stash', stash);
app.use('/api/snippet', snippet);
app.use('/', index); // index routes

// ERROR HANDLER //
app.use(function(err, req, res, next) { res.status(err.status || 500); });

module.exports = app;

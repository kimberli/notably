var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var RECENT_SESSIONS = 5;

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    numSubmitted: Number,
    numSaved: Number,
    numSubscribed: Number,
    recentSessions: [{type: mongoose.Schema.Types.ObjectId, ref:'Session'}], //in order from most to least recent
    courses: [{type: mongoose.Schema.Types.ObjectId, ref:'Course'}]
});

/**
 * Find a user if exists; return error otherwise
 *
 * @param rawUsername {string} - username of a potential user
 * @param callback {function} - function to be called with err and result
 */
var findUser = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    User.find({ username: username }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('User not found');
    });
}

/**
 * Assert username is valid; return error otherwise
 *
 * @param rawUsername {string} - username of a potential user
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.auth = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback(err);
        else {
            callback(null, {username: result.username});
        }
    })
}

/**
 * Get a user's profile if exists; return error otherwise
 *
 * @param rawUsername {string} - username of a potential user
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.findProfile = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback(err);
        else {
            callback(null, {
                username: result.username,
                name: result.name,
                stats: {
                    numSubscribed: result.numSubscribed,
                    numSaved: result.numSaved,
                    numSubmitted: result.numSubmitted
                },
                courses: result.courses,
            });
        }
    });
}

/**
 * Authenticate a user
 *
 * @param rawUsername {string} - username to check
 * @param candidatepw {string} - password to check
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.verifyPassword = function(rawUsername, candidatepw, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback('Incorrect username/password combination');
        else {
            if (bcrypt.compareSync(candidatepw, result.password)) {
                callback(null, {username: username});
            } else callback('Incorrect username/password combination');
        }
    });
}

/**
 * Create a new user

 * @param rawUsername {string} - username to create
 * @param password {string} - password
 * @param name {string} - name
 * @param email {string} - email
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.createNewUser = function(rawUsername, password, name, email, callback) {
    var username = rawUsername.toLowerCase();
    if (username.match('^[a-z0-9_-]{3,16}$')) {
        if(typeof password === 'string') {
            if (email.match('^[a-z0-9_-]+@mit.edu$')) {
                User.find({$or: [{username: username}, {email: email}]}, function(err, result) {
                    if (err) callback(err);
                    else if (result.length === 0) {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);
                        var user = new User({
                            username: username,
                            password: hash,
                            name: name,
                            email: email,
                            numSubmitted: 0,
                            numSaved: 0,
                            numSubscribed: 0,
                            stashes: [],
                            courses: []
                        });
                        user.save(function(err,result) {
                            if (err) callback(err);
                            else callback(null, {username: username});
                        });
                    } else callback('User already exists');
                });
            } else callback('Must have MIT email address');
        } else callback('Invalid password');
    } else callback('Invalid username (must be between 3 and 16 characters and consist of letters, numbers, underscores, and hyphens)');
}

/**
 * Subscribe to a new course
 *
 * @param rawUsername {string} - username
 * @param courseId {string} - course id that user is subscribing to; must be valid course
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.addCourse = function(rawUsername, courseId, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            if (user.courses.indexOf(courseId) > -1) { callback('Already subscribed') }
            else {
                user.courses.push(courseId);
                user.numSubscribed += 1;
                user.save(function(err, result) {
                    if (err) callback(err);
                    else User.findProfile(rawUsername, callback);
                });
            }
        }
    });
}

/**
 * Unsubscribe to a course
 *
 * @param rawUsername {string} - username
 * @param courseId {string} - course id that user is unsubscribing from; must be valid course
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.removeCourse = function(rawUsername, courseId, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            if (user.courses.indexOf(courseId) == -1) { callback('Already unsubscribed') }
            else {
                user.courses.splice(user.courses.indexOf(courseId), 1);
                user.numSubscribed -= 1;
                user.save(function(err, result) {
                    if (err) callback(err);
                    else User.findProfile(rawUsername, callback);
                });
            }
        }
    });
}

/**
 * Increment user's number of snippets submitted
 *
 * @param rawUsername {string} - username
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.incrementSubmitted = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            user.numSubmitted += 1;
            user.save(function(err, result) {
                if (err) callback(err);
                else callback(null, {numSubmitted: user.numSubmitted})
            });
        }
    });
}

/**
 * Increment user's number of snippets saved
 *
 * @param rawUsername {string} - username
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.incrementSaved = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            user.numSaved += 1;
            user.save(function(err, result) {
                if (err) callback(err);
                else callback(null, {numSaved: user.numSaved});
            });
        }
    });
}

/**
 * Decrement user's number of snippets saved
 *
 * @param rawUsername {string} - username
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.decrementSaved = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            if (user.numSaved <= 0) callback('Illegal operation');
            else {
                user.numSaved -= 1;
                user.save(function(err, result) {
                    if (err) callback(err);
                    else callback(null, {numSaved: user.numSaved});
                });
            }
        }
    });
}

/**
 * Track user's 10 recently accessed sessions
 *
 * @param rawUsername {string} - username
 * @param sessionId {string} - session id just accessed; must be valid session
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.addRecentSession = function(rawUsername, sessionId, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, user) {
        if (err) callback(err);
        else {
            if (user.recentSessions.indexOf(sessionId) > -1) { //if sessionId is in most recent, remove it
                user.recentSessions.splice(user.recentSessions.indexOf(sessionId), 1);
            }
            user.recentSessions.splice(0, 0 , sessionId); //insert sessionId into front of recentSessions
            if (user.recentSessions.length > RECENT_SESSIONS) {
                user.recentSessions.pop();
            }
            user.save(function(err, result) {
                if (err) callback(err);
                else callback(null, {recentSessions: user.recentSessions});
            })
        }
    });
}

var User = mongoose.model('User', userSchema);

module.exports = User;

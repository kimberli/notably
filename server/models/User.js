var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Course = require('./Course');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
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
            User.getCourses(username, function(err, courses) {
                if (err) callback(err);
                else callback(null, {
                    username: result.username,
                    name: result.name,
                    courses: courses.courses
                })
            });
        }
    })
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
 * Get a particular stash belonging to a user.
 *
 * @param rawUsername {string} - username of user
 * @param stashId {ObjectId} - ID of stash
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getStash = function(rawUsername, stashId, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback(err);
        else {
            if (user.stashes.indexOf(stashId) < 0) { callback('Stash not found'); }
            else {
                Stash.findById(stashId, function(err, result) {
                    if (err) callback(err);
                    else callback(null, result);
                });
            }
        }
    });
}

/**
 * Get all stashes belonging to a user.
 *
 * @param rawUsername {string} - username to get stashes for
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getStashes = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback(err);
        else {
            Stash.find({'_id': { $in: result.stashes}}, function(err, stashes) {
                if (err) callback(err);
                else {
                    callback(null,
                        stashes.map(function(item) {
                            return {
                                name: item.name,
                                _id: item._id
                            };
                        })
                    );
                }
            });
        }
    });
}

/**
 * Create a new stash
 *
 * @param rawUsername {string} - username creating stash
 * @param session {ObjectId} - ID of session that stash is being made for
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.addStash = function(rawUsername, sessionId, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
    if (err) callback(err);
    else {
        var newStash = new Stash({
            creator: result.username,
            session: ObjectId(sessionId),
            snippets: []
        });
        result.stashes.push(newStash);
        result.save(function(err) {
            if (err) callback(err);
            else callback(null, { username: username });
        });
    }
    });
}

/**
 * Get all courses a user is subscribed to
 *
 * @param rawUsername {string} - username to get stashes for
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getCourses = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    findUser(username, function(err, result) {
        if (err) callback(err);
        else {
            var result = [];
            Course.find({'_id': { $in: result.courses}}, function(err, courses) {
                if (err) callback(err);
                else {
                    callback(null,
                        courses.map(function(item) {
                            return {
                                name: item.name,
                                number: item.number
                            };
                        })
                    );
                }
            });
        }
    });
}

/**
 * Subscribe to a new course
 *
 * @param rawUsername {string} - username
 * @param courseNumber {string} - course number that user is subscribing to
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.addCourse = function(rawUsername, courseNumber, callback) {
    var username = rawUsername.toLowerCase();
    Course.findCourse(courseNumber, function(err, result) {
        if (err) callback(err);
        else {
            findUser(username, function(err, user) {
                if (err) callback(err);
                user.courses.push(ObjectId(result._id));
                user.save(function(err) {
                    if (err) callback(err);
                    else {
                        this.getCourses(username, callback);
                    }
                })
            });
        }
    });
}

var User = mongoose.model('User', userSchema);

module.exports = User;

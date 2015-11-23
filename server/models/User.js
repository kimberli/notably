var mongoose = require('mongoose');
var Stash = require('./Stash');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
});

/**
 * Find a user if exists; return error otherwise
 *
 * @param rawUsername {string} - username of a potential user
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.findUser = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    this.find({ username: username }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('User not found');
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
    this.findUser(username, function(err, user) {
        if (user) {
            if (bcrypt.compareSync(candidatepw, user.password)) {
                callback(null, true);
            } else {
                callback('Incorrect username/password combination', false);
            }
        } else {
            callback('Incorrect username/password combination', false);
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
                this.find({$or: [{username: username}, {email: email}]}, function(err, result) {
                    if (err) callback(err);
                    else if (result.length === 0) {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);
                        var user = new User({
                            username: username,
                            password: hash,
                            name: name,
                            email: email,
                            stashes: []
                        });
                        user.save(function(err,result) {
                            if (err) callback(err);
                            else callback(null, {username: username});
                        });
                    } else { callback('User already exists'); }
                });
            } else { callback('Must have MIT email address'); }
        } else { callback('Invalid password'); }
    } else { callback('Invalid username (must be between 3 and 16 characters and consist of letters, numbers, underscores, and hyphens)'); }
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
    this.findUser(username, function(err, result) {
        if (err) { callback(err); }
        else {
            if (user.stashes.indexOf(stashId) < 0) { callback('Stash not found'); }
            else {
                Stash.findById(stashId, function(err, result) {
                    if (err) { callback(err); }
                    else {
                        callback(null, result);
                    }
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
    this.findUser(username, function(user) {
        if (user) {
            Stash.find({'_id': { $in: user.stashes}}, callback);
        } else {
            callback('User does not exist', false);
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
userSchema.statics.addStash = function(rawUsername, session, callback) {
    var username = rawUsername.toLowerCase();
    this.findUser(username, function(user) {
    if (user) {
        var newStash = new Stash({
            creator: user,
            session: session,
            snippets: []
        });
        user.stashes.push(newStash);
        user.save(function(err) {
            if (err) {
                callback(err, false);
            } else {
                newStash.save(callback);
            }
        });
    } else {
        callback('User does not exist', false);
    }
    });
}

/**
 * Clear all users
 */
userSchema.statics.clearUsers = function() {
    this.remove({}, function() {});
}

var User = mongoose.model('User', userSchema);

module.exports = User;

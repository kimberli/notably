var mongoose = require('mongoose');
var Snippet = require('./Snippet');
var Stash = require('./Stash');
var User = require('./User');

var sessionSchema = mongoose.Schema({
    number: String,
    title: String,
    createdAt: Date,
    createdBy: String,
    stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
    feed: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

/**
 * Get a session if exists; return error otherwise
 *
 * @param sessionId {string} - session id
 * @param callback {function} - function to be called with err and result
 */
var getSession = function(sessionId, callback) {
    Session.find({ _id: sessionId }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Session not found');
    });
}

/**
 * Create a session
 *
 * @param number {string} - course number; must be valid
 * @param title {string} - session title; must be valid
 * @param rawUsername {string} - username of session creator; must be valid
 * @param callback {function} - function to be called with err and result
 */
sessionSchema.statics.create = function(number, title, rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    var newSession = new Session({
        number: number,
        title: title,
        createdBy: username,
        createdAt: Date.now(),
        stashes: [],
        feed: []
    });
    newSession.save(callback);
}

/**
 * Find a session if exists; return error otherwise
 *
 * @param sessionId {string} - session id
 * @param callback {function} - function to be called with err and result
 */
sessionSchema.statics.findSession = function(sessionId, callback) {
    Session.find({ _id: sessionId }, function(err, result) {
        if (err) callback(err);
        else {
            getSession(sessionId, function(err, session) {
                if (err) callback(err);
                else {
                    Snippet.find({ _id: { $in: session.feed } }, function(err, result) {
                        if (err) callback(err);
                        else callback(null, {
                            _id: session._id,
                            meta: {
                                title: session.title,
                                number: session.number
                            },
                            feed: result
                        });
                    })
                }
            })
        }
    });
}

/**
 * Add stash to a session
 *
 * @param sessionId {string} - session id
 * @param username {string} - username of creator; must be valid
 * @param callback {function} - function to be called with err and result
 */
sessionSchema.statics.addStash = function(sessionId, username, callback) {
    getSession(sessionId, function(err, session) {
        if (err) callback(err);
        else {
            Stash.findBySessionAndUsername(sessionId, username, function(err, result) {
                if (err === 'Stash not found') {
                    Stash.create(username, session._id, session.title, session.number, function(err, newStash) {
                        if (err) callback(err);
                        else {
                            session.stashes.push(newStash);
                            session.save(function(err) {
                                if (err) callback(err);
                                else newStash.save(callback);
                            });
                        }
                    });
                }
                else if (err) callback(err);
                else callback('Stash already exists');
            });
        }
    });
}

/**
 * Create a new snippet
 *
 * @param sessionId {string} - id of session
 * @param currentUser {string} - username of current user; must be valid
 * @param text {string} - content of the snippet
 * @param callback {function} - function to be called with err and result
 */
sessionSchema.statics.addSnippet = function(sessionId, currentUser, text, callback) {
    getSession(sessionId, function(err, session) {
        if (err) callback(err);
        else {
            Stash.findBySessionAndUsername(sessionId, currentUser, function(err, stash) {
                if (err) callback(err);
                else {
                    Snippet.create(currentUser, text, sessionId, function(err, newSnippet) {
                        if (err) callback(err);
                        else {
                            session.feed.push(newSnippet);
                            session.save(function(err) {
                                if (err) callback(err);
                                else {
                                    stash.snippets.push(newSnippet);
                                    stash.save(function(err) {
                                        if (err) callback(err);
                                        else {
                                            newSnippet.save(function(err) {
                                                if (err) callback(err);
                                                else {
                                                    User.find({ username: currentUser }, function(err, result) {
                                                        if (err) callback(err);
                                                        else if (result.length > 0) {
                                                            var user = result[0];
                                                            user.numSubmitted += 1;
                                                            user.save(callback);
                                                        }
                                                        else callback('User not found');
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

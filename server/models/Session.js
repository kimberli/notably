var mongoose = require('mongoose');
var Snippet = require('./Snippet');
var Stash = require('./Stash');

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
                if (err === 'Session not found') {
                    var newStash = new Stash({
                        creator: username,
                        session: session._id,
                        createdAt: Date.now(),
                        snippets: []
                    });
                    session.stashes.push(newStash);
                    session.save(function(err) {
                        if (err) callback(err);
                        else newStash.save(function(err) {
                            if (err) callback(err);
                            else callback(null, {
                                _id: newStash._id,
                                creator: newStash.creator,
                                createdAt: newStash.createdAt,
                                snippets: newStash.snippets
                            })
                        })
                    })
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
                    var newSnippet = new Snippet({
                        author: stash.creator,
                        text: text,
                        timestamp: Date.now(),
                        saveCount: 0,
                        hidden: false,
                        flaggedBy: [],
                        savedBy: [stash.creator],
                        sessionId: session._id
                    });
                    var id = stash._id;
                    session.feed.push(newSnippet);
                    session.save(function(err) {
                        if (err) callback(err);
                        else {
                            var stash = Stash.getStash(id, function(err, stash) {
                                stash.snippets.push(newSnippet);
                                stash.save(function(err) {
                                    if (err) callback(err);
                                    else newSnippet.save(callback);
                                });
                            });
                        }
                    })
                }
            })
        }
    });
}

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

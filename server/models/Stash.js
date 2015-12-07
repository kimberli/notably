var mongoose = require('mongoose');
var Snippet = require('./Snippet');
var User = require('./User');

var stashSchema = mongoose.Schema({
    creator: String,
    createdAt: Date,
    sessionTitle: String,
    courseNumber: String,
    session: {type: mongoose.Schema.Types.ObjectId, ref:'Session'},
    snippets: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

/**
 * Get a stash if exists; return error otherwise
 *
 * @param stashId {string} - stash id
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.getStash = function(stashId, callback) {
    Stash.find({ _id: stashId }, function(err, result) {
        if (err) callback('Stash not found');
        else if (result.length > 0) callback(null, result[0]);
        else callback('Stash not found');
    });
}

/**
 * Create a stash
 *
 * @param rawUsername {string} - username of snippet author; must be valid
 * @param sessionId {string} - session id; must be valid
 * @param sessionTitle {string} - session title; must be valid
 * @param courseNumber {string} - course number; must be valid
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.create = function(rawUsername, sessionId, sessionTitle, courseNumber, callback) {
    var username = rawUsername.toLowerCase();
    var newStash = new Stash({
        creator: username,
        createdAt: Date.now(),
        sessionTitle: sessionTitle,
        courseNumber: courseNumber,
        snippets: [],
        session: sessionId
    });
    newStash.save(function(err, result) {
        if (err) callback('Error saving stash');
        else callback(null, result);
    });
}

/**
 * Find a stash by stashId
 *
 * @param stashId {string} -  id of stash
 * @param callback {function} - function to be called with err and result
 *
 */
stashSchema.statics.findByStashId = function(stashId, callback) {
    Stash.find({ _id: stashId }, function(err, result) {
        if (err) callback('Stash not found');
        else if (result.length > 0) callback(null, result[0]);
        else callback('Stash not found');
    }).populate('snippets');
}


/**
 * Find a stash by session and username
 *
 * @param sessionId {string} - session id of stash
 * @param username {string} - username of creator
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.findBySessionAndUsername = function(sessionId, rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    Stash.find({ creator: username, session: sessionId }, function(err, result) {
        if (err) callback('Stash not found');
        else if (result.length > 0) callback(null, result[0]);
        else callback('Stash not found');
    }).populate('snippets');
}

/**
 * Save a snippet to current user's stash
 *
 * @param snippetId {string} - id of snippet to be saved
 * @param stashId {string} - id of stash
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.saveSnippet = function(snippetId, stashId, callback) {
    Stash.getStash(stashId, function(err, stash) {
        if (err) callback(err);
        else {
            var username = stash.creator;
            Snippet.findSnippet(snippetId, function(err, snippet) {
                if (err) callback(err);
                else {
                    if (snippet.sessionId.toString() !== stash.session.toString()) callback('Snippet does not belong to this session');
                    else if (snippet.savedBy.indexOf(username) > -1) callback('Snippet already saved');
                    else {
                        snippet.saveCount += 1;
                        snippet.savedBy.push(username);
                        snippet.save(function(err) {
                            if (err) callback('Error saving snippet');
                            else {
                                User.incrementSaved(username, function(err, result) {
                                    if (err) callback(err);
                                    else {
                                        stash.snippets.push(snippet);
                                        stash.save(function(err, result) {
                                            if (err) callback('Error saving stash');
                                            else callback(null, result);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}

/**
 * Remove a snippet from the current user's stash
 *
 * @param snippetId {string} - ID of snippet to be removed
 * @param stashId {string} - ID of stash that snippet is removed from
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.removeSnippet = function(snippetId, stashId, callback) {
    Stash.getStash(stashId, function(err, stash) {
        if (err) callback(err);
        else {
            var username = stash.creator;
            Snippet.findSnippet(snippetId, function(err, snippet) {
                if (err) callback(err);
                else {
                    if (stash.snippets.indexOf(snippet._id) == -1) callback('Snippet not in stash');
                    else {
                        if (snippet.saveCount <= 0) callback('Invalid save count');
                        else {
                            snippet.savedBy.splice(snippet.savedBy.indexOf(username), 1);
                            snippet.saveCount -= 1;
                            snippet.save(function(err) {
                                if (err) callback('Error saving snippet');
                                else {
                                    User.decrementSaved(username, function(err, result) {
                                        if (err) callback(err);
                                        else {
                                            stash.snippets.splice(stash.snippets.indexOf(snippet._id), 1);
                                            stash.save(function(err, result) {
                                                if (err) callback('Error saving stash');
                                                else callback(null, result);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
    });
}

var Stash = mongoose.model('Stash', stashSchema);

module.exports = Stash;

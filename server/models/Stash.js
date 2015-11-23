var mongoose = require('mongoose');
var Snippet = require('./Snippet');

var stashSchema = mongoose.Schema({
    creator: String,
    createdAt: String,
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
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Stash not found');
    });
}

/**
 * Create a stash
 *
 * @param rawUsername {string} - username of snippet author; must be valid
 * @param sessionId {string} - session id; must be valid
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.create = function(rawUsername, sessionId, callback) {
    var username = rawUsername.toLowerCase();
    var newStash = new Stash({
        creator: username,
        createdAt: Date.now(),
        snippets: [],
        session: sessionId
    });
    newStash.save(callback);
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
    Stash.find({ creator: username, session: sessionId}, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) {
            var stash = result[0];
            Snippet.find({ _id: {$in: stash.snippets}}, function(err, result) {
                if (err) callback(err);
                else {
                    stash.snippets = result.map(function(item) {
                        return {
                            _id: item._id,
                            author: item.author,
                            text: item.text,
                            timestamp: item.timestamp
                        }
                    });
                    callback(null, stash)
                }
            });
        } else callback('Session not found');
    });
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
                   if (snippet.savedBy.indexOf(username) == -1) {
                        snippet.saveCount += 1;
                        snippet.savedBy.push(username);
                        snippet.save(function(err) {
                            if (err) {
                                callback(err, false);
                            } else {
                                stash.snippets.push(snippet);
                                stash.save(callback);
                            }
                        });
                    } else callback('Snippet already saved');
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
            Snippet.findSnippet(snippetId, function(err, snippet) {
                if (err) callback(err);
                else {
                    if (stash.snippets.indexOf(snippet._id) > -1) {
                        snippet.savedBy.splice(snippet.savedBy.indexOf(stash.creator), 1);
                        snippet.saveCount -= 1;
                        snippet.save(function(err) {
                            if (err) callback(err);
                            else {
                                stash.snippets.splice(stash.snippets.indexOf(snippet._id), 1);
                                stash.save(callback);
                            }
                        })
                    } else callback('Snippet not in stash');
                }
            });
        }
    });
}

var Stash = mongoose.model('Stash', stashSchema);

module.exports = Stash;

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
var getStash = function(stashId, callback) {
    Stash.find({ _id: stashId }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Stash not found');
    });
}


/**
 * Find a stash by session and username
 *
 * @param sessionId {string} - session id of stash
 * @param username {string} - username of creator
 * @param callback {function} - function to be called with err and result
 */
stashSchema.methods.findBySessionAndUsername = function(sessionId, rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    Stash.find({ creator: username, session: sessionId}, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) {
            var stash = result[0];
            Snippet.find({ _id: {$in: stash.snippets}}, function(err, result) {
                if (err) callback(err);
                else callback(null, {
                    _id: result[0]._id,
                    creator: username,
                    session: sessionId,
                    snippets: result.map(function(item) {
                        return {
                            _id: item._id,
                            author: item.author,
                            text: item.text,
                            timestamp: item.timestamp
                        }
                    })
                })
            });
        } else callback('Session not found');
    });
}

/** TODO
 * Save a snippet to current user's stash
 *
 * @param snippetId {string} - id of snippet to be saved
 * @param stashId {string} - id of stash
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.saveSnippet = function(snippetId, stashId, callback) {
    var username = rawUsername.toLowerCase();
    Snippet.findSnippet(snippetId, function(err, snippet) {
        if (err) {
            callback('Snippet does not exist.', false);
        } else {
            snippet.saves += 1;
            snippet.save(function(err) {
            if (err) {
                callback(err, false);
            } else {
                this.snippets.push(snippet);
                this.save(function(err) {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
              });
            }
          });
        }
    });
}

/** TODO
 * Remove a snippet from the current user's stash
 *
 * @param snippetId {ObjectId} - ID of snippet to be deleted
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.removeSnippet = function(snippetId, callback) {
    var index = this.snippets.indexOf(snippetId);
    if (index > -1) {
        this.snippets.splice(index, 1);
    }
    this.save(callback);
}

var Stash = mongoose.model('Stash', stashSchema);

module.exports = Stash;

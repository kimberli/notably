var mongoose = require('mongoose');

var snippetSchema = mongoose.Schema({
    author: String,
    text: String,
    timestamp: Date,
    saveCount: Number,
    savedBy: [String],
    flagCount: Number,
    flaggedBy: [String],
    sessionId: String
});

/**
 * Find a snippet if exists; return error otherwise
 *
 * @param snippetId {string} - snippet id
 * @param callback {function} - function to be called with err and result
 */
snippetSchema.statics.findSnippet = function(snippetId, callback) {
    this.find({ _id: snippetId }, function(err, result) {
        if (err) callback('Snippet not found');
        else if (result.length > 0) callback(null, result[0]);
        else callback('Snippet not found');
    });
}

/**
 * Create a snippet
 *
 * @param rawUsername {string} - username of snippet author; must be valid
 * @param text {string} - snippet text
 * @param sessionId {string} - session id; must be valid
 * @param callback {function} - function to be called with err and result
 */
snippetSchema.statics.create = function(rawUsername, text, sessionId, callback) {
    var username = rawUsername.toLowerCase();
    var newSnippet = new Snippet({
        author: username,
        text: text,
        timestamp: Date.now(),
        saveCount: 1,
        flagCount: 0,
        flaggedBy: [],
        savedBy: [username],
        sessionId: sessionId
    });
    newSnippet.save(function(err, result) {
        if (err) callback('Error saving callback');
        else callback(null, result);
    });
}

/**
 * Flag a snippet
 *
 * @param snippetId {ObjectId} - ID of snippet to be flagged
 * @param currentUser {string} - username of current user; must be valid
 * @param callback {function} - function to be called with err and result
 */
snippetSchema.statics.flagSnippet = function(snippetId, currentUser, callback) {
    Snippet.findSnippet(snippetId, function(err, snippet) {
        if (err) callback(err);
        else {
            if (snippet.author !== currentUser.toLowerCase()) {
                if (snippet.flaggedBy.indexOf(currentUser) == -1) {
                    snippet.flagCount += 1;
                    snippet.flaggedBy.push(currentUser);
                    snippet.save(callback);
                } else {
                  callback('Snippet already flagged');
                }
            } else callback('User cannot flag own snippet');
        }
    });
}

var Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;

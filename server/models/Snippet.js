var mongoose = require('mongoose');

var snippetSchema = mongoose.Schema({
    author: String,
    text: String,
    timestamp: Date,
    saveCount: Number,
    hidden: Boolean,
    savedBy: [String],
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
        if (err) callback(err);
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
        hidden: false,
        flaggedBy: [],
        savedBy: [username],
        sessionId: sessionId
    });
    newSnippet.save(callback);
}

/** TODO
 * Flag a snippet
 *
 * @param snippetId {ObjectId} - ID of snippet to be flagged
 * @param callback {function} - function to be called with err and result
 */
snippetSchema.statics.flagSnippet = function(snippetId, callback) {
    var Snippet = this;
    Snippet.findById(snippetId, function(err, snippet) {
        if (err) {
            callback('Snippet does not exist.', false);
        } else {
            snippet.flagged = true;
            snippet.save(function(err) {
            if (err) {
                callback('Error.', false);
          	} else {
                callback(null, true);
          	}
          });
        }
    });
}

var Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;

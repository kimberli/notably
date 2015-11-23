var mongoose = require('mongoose');
var User = require('./User');
var Stash = require('./Stash');

var snippetSchema = mongoose.Schema({
    author: String,
    text: String,
    timestamp: Date,
    saves: Number,
    hidden: Boolean,
    savedBy: [String],
    flaggedBy: [String]
});

/**
 * Find a snippet if exists; return error otherwise
 *
 * @param id {string} - snippet id
 * @param callback {function} - function to be called with err and result
 */
snippetSchema.statics.findSnippet = function(id, callback) {
    this.find({ _id: id }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Course not found');
    });
}

/**
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

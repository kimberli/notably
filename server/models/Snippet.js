var mongoose = require('mongoose');
var User = require('./User');
var Stash = require('./Stash');

var snippetSchema = mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  content: String,
  timestamp: Date,
  saves: Number,
  flagged: Boolean,
  savedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  flaggedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

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

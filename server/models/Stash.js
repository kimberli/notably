var mongoose = require('mongoose');
var User = require('./User');
var Snippet = require('./Snippet');
var Session = require('./Session');

var stashSchema = mongoose.Schema({
  creator: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  session: {type: mongoose.Schema.Types.ObjectId, ref:'Session'},
  snippets: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

/**
 * Create a new snippet
 *
 * @param currentUser {ObjectID} - ID of current user
 * @param snippet {string} - content of the snippet
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.addSnippet = function(currentUser, snippet, callback) {
  var Stash = this;
  var newSnippet = new Snippet({
  	author: currentUser,
    content: snippet,
    timestamp: Date.now(),
    saves: 0,
    flagged: false
  });
  Stash.snippets.push(newSnippet);
  Stash.save(function(err) {
  	if (err) {
  	  callback('Error.', false);
  	} else {
  	  newSnippet.save(callback);
  	}
  });
}

/**
 * Save a snippet to current user's stash
 *
 * @param snippetId {ObjectId} - ID of snippet to be saved
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.saveSnippet = function(snippetId, callback) {
  var Stash = this;
  Snippet.findById(snippetId, function(err, snippet) {
  	if (err) {
  	  callback('Snippet does not exist.', false);
  	} else {
  	  snippet.saves += 1;
  	  snippet.save(function(err) {
  	    if (err) {
  	      callback('Error', false);
  	    } else {
  	      Stash.snippets.push(snippet);
  	      Stash.save(function(err) {
  	      	if (err) {
  	          callback('Error.', false);
  	        } else {
  	          callback(null, true);
  	        }
  	      });
  	    }
  	  });
  	}
  });
}

/**
 * Remove a snippet from the current user's stash
 *
 * @param snippetId {ObjectId} - ID of snippet to be deleted
 * @param callback {function} - function to be called with err and result
 */
stashSchema.statics.removeSnippet = function(snippetId, callback) {
  var Stash = this;
  var index = Stash.snippets.indexOf(snippetId);
  if (index >= 0) {
    Stash.snippets.splice(index, 1);
  }
  Stash.save(callback);
}

var Stash = mongoose.model('Stash', stashSchema);

module.exports = Stash;

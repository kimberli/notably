var mongoose = require('mongoose');
var User = require('./User');
var Snippet = require('./Snippet');
var Session = require('./Session');

var stashSchema = mongoose.Schema({
  creator: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  session: {type: mongoose.Schema.Types.ObjectId, ref:'Session'},
  snippets: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

var Stash = mongoose.model('Stash', stashSchema);

module.exports = Stash;
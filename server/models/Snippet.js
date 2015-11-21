var mongoose = require('mongoose');
var User = require('./User');
var Stash = require('./Stash');

var snippetSchema = mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  content: String,
  timestamp: Date,
  saves: Number,
  flagged: Boolean
});

var Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
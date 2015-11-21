var mongoose = require('mongoose');
var Stash = require('./Stash');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
});

var User = mongoose.model('User', userSchema);

module.exports = User;
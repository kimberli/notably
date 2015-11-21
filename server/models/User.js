var mongoose = require('mongoose');
var Stash = require('./Stash');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
});

/*
  User methods for properly registering accounts with a username and password.
  Usernames should be unique, and the server should authenticate user credentials.
*/
userSchema.statics.userExists = function(username, callback) {
  var User = this;
  User.findOne({username: username}, function(err, result) {
    if (err) {
      console.log(err);
      return callback(false);
    } else {
      return callback(result);
    }
  });
}

userSchema.statics.verifyPassword = function(username, candidatepw, callback) {
  var User = this;
  User.userExists(username, function(user) {
    if (user) {
      if (user.password === candidatepw) {
        callback(null, true);
      } else {
        callback('Wrong password.', false);
      }
    } else {
      callback('User does not exist.', false);
    }
  });
}

userSchema.statics.createNewUser = function(username, password, name, email, callback) {
  var User = this;
  User.userExists(username, function(user) {
    if (user) {
      callback('Username already taken.', false);
    } else {
      User.create({
        username: username,
        password: password,
        name: name,
        email: email,
        stashes: []
      }, callback);
    }
  });
}

/*
  Get a particular stash belonging to a user.
*/
userSchema.statics.getStash = function(stashId, callback) {
  Stash.findById(stashId, callback);
}

/*
  Get all stashes belonging to a user.
*/
userSchema.statics.getStashes = function(username, callback) {
  var User = this;
  User.userExists(username, function(user) {
    if (user) {
      Stash.find({'_id': { $in: user.stashes}}, callback);
    } else {
      callback('User does not exist.', false);
    }
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
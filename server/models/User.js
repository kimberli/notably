var mongoose = require('mongoose');
var Stash = require('./Stash');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
});

/**
 * Check if a user already exists; usernames must be unique.

 * @param rawUsername {string} - username of a potential user
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.userExists = function(rawUsername, callback) {
  var User = this;
  var username = rawUsername.toLowerCase();
  User.findOne({username: username}, function(err, result) {
    if (err) {
      console.log(err);
      return callback(false);
    } else {
      return callback(result);
    }
  });
}

/**
 * Authenticate a user

 * @param rawUsername {string} - username to check
 * @param candidatepw {string} - password to check
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.verifyPassword = function(rawUsername, candidatepw, callback) {
  var User = this;
  var username = rawUsername.toLowerCase();
  User.userExists(username, function(user) {
    if (user) {
      if (bcrypt.compareSync(candidatepw, user.password)) {
        callback(null, true);
      } else {
        callback('Wrong password.', false);
      }
    } else {
      callback('User does not exist.', false);
    }
  });
}

/**
 * Create a new user

 * @param rawUsername {string} - username to create
 * @param password {string} - password
 * @param name {string} - name
 * @param email {string} - email
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.createNewUser = function(rawUsername, password, name, email, callback) {
  var User = this;
  var username = rawUsername.toLowerCase();
  // Should we check that email has valid format?
  if (username.match("^[a-z0-9_-]{3,16}") && typeof password === 'string') {
    User.userExists(username, function(user) {
      if (user) {
        callback('Username already taken.', false);
      } else {
      	var salt = bcrypt.genSaltSync(10);
      	var hash = bcrypt.hashSync(password, salt);
        User.create({
          username: username,
          password: hash,
          name: name,
          email: email,
          stashes: []
        }, callback);
      }
    });
  } else {
  	callback('Invalid username/password.', false);
  }
}

/**
 * Get a particular stash belonging to a user.
 *
 * @param stashId {ObjectId} - ID of stash
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getStash = function(stashId, callback) {
  Stash.findById(stashId, funtion(err, stash) {
    if (err) {
      callback('Stash does not exist.', false);
    } else {
      callback(stash);
    }
  });
}

/**
 * Get all stashes belonging to a user.
 *
 * @param rawUsername {string} - username to get stashes for
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.getStashes = function(rawUsername, callback) {
  var User = this;
  var username = rawUsername.toLowerCase();
  User.userExists(username, function(user) {
    if (user) {
      Stash.find({'_id': { $in: user.stashes}}, callback);
    } else {
      callback('User does not exist.', false);
    }
  });
}

/**
 * Create a new stash
 *
 * @param rawUsername {string} - username creating stash
 * @param session {ObjectId} - ID of session that stash is being made for
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.addStash = function(rawUsername, session, callback) {
  var User = this;
  var username = rawUsername.toLowerCase();
  User.userExists(username, function(user) {
    if (user) {
      var newStash = new Stash({
        creator: user,
        session: session,
        snippets: []
      });
      user.stashes.push(newStash);
      user.save(function(err) {
        if (err) {
          callback('Error.', false);
        } else {
          newStash.save(callback);
        }
      });
    } else {
      callback('User does not exist.', false);
    }
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;

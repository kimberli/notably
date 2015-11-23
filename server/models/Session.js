var mongoose = require('mongoose');
var Snippet = require('./Snippet');

var sessionSchema = mongoose.Schema({
    title: String,
    createdAt: Date,
    course: {type: mongoose.Schema.Types.ObjectId, ref:'Course'},
    stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
    feed: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Snippet = require('./Snippet');

var sessionSchema = mongoose.Schema({
    number: String,
    title: String,
    createdAt: Date,
    createdBy: String,
    stashes: [{type: mongoose.Schema.Types.ObjectId, ref:'Stash'}],
    feed: [{type: mongoose.Schema.Types.ObjectId, ref:'Snippet'}]
});

/**
 * Find a session if exists; return error otherwise
 *
 * @param sessionId {string} - session id
 * @param callback {function} - function to be called with err and result
 */
sessionSchema.statics.findSession = function(sessionId, callback) {
    this.find({ _id: ObjectId(sessionId) }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) {
            var session = result[0];
            Snippet.find({ _id: { $in: session.feed } }, function(err, result) {
                if (err) callback(err);
                else callback(null, {
                    _id: session._id,
                    meta: {
                        title: session.title,
                        number: session.number
                    },
                    snippets: result.map(function(item) {
                        return {
                            _id: item._id,
                            author: item.author,
                            text: item.text
                        };
                    })
                });
            })
        }
        else callback('Session not found');
    });
}

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

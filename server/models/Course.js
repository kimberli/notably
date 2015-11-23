var mongoose = require('mongoose');
var Session = require('./Session');

var courseSchema = mongoose.Schema({
    name: String,
    number: Number,
    professor: String,
    description: String,
    sessions: [{type: mongoose.Schema.Types.ObjectId, ref:'Session'}]
});

/**
 * Find a course if exists; return error otherwise
 *
 * @param number {string} - course number
 * @param callback {function} - function to be called with err and result
 */
userSchema.statics.findCourse = function(number, callback) {
    this.find({ number: number }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Course not found');
    });
}

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;

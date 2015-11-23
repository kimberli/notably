var mongoose = require('mongoose');
var Session = require('./Session');

var courseSchema = mongoose.Schema({
    name: String,
    number: String,
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
courseSchema.statics.findCourse = function(number, callback) {
    this.find({ number: number }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Course not found');
    });
}

/**
 * Get all courses
 *
 * @param callback {function} - function to be called with err and result
 */
courseSchema.statics.getAllCourses = function(callback) {
    this.find({}, function(err, courses) {
        if (err) callback(err);
        else callback(null, {courses:
            courses.map(function(item) {
                return {
                    name: item.name,
                    number: item.number
                };
            }) }
        );
    });
}


var Course = mongoose.model('Course', courseSchema);

module.exports = Course;

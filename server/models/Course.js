var mongoose = require('mongoose');
var Session = require('./Session');

var courseSchema = mongoose.Schema({
    name: String,
    number: String,
    lectureTime: String,
    location: String,
    description: String,
    sessions: [{type: mongoose.Schema.Types.ObjectId, ref:'Session'}]
});

/**
 * Get a course if exists; return error otherwise
 *
 * @param number {string} - number of course
 * @param callback {function} - function to be called with err and result
 */
var getCourse = function(number, callback) {
    Course.find({ number: number }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback('Course not found');
    });
}


/**
 * Find a course if exists; return error otherwise
 *
 * @param number {string} - course number
 * @param callback {function} - function to be called with err and result
 */
courseSchema.statics.findCourse = function(number, callback) {
    getCourse(number, function(err, course) {
        if (err) callback(err);
        else {
            Session.find({ _id: { $in: course.sessions } }, function(err, result) {
                if (err) callback(err);
                else callback(null, {
                    _id: course._id,
                    meta: {
                        name: course.name,
                        number: course.number,
                        description: course.description,
                        lectureTime: course.lectureTime,
                        location: course.location,
                    },
                    sessions: result.map(function(item) {
                        return {
                            _id: item._id,
                            title: item.title,
                            createdAt: item.createdAt
                        };
                    })
                });
            })
        }
    });
}

/**
 * Get all courses
 *
 * @param callback {function} - function to be called with err and result
 */
courseSchema.statics.getAllCourses = function(callback) {
    Course.find({}, function(err, courses) {
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

/**
 * Add session to a course
 *
 * @param number {string} - course number
 * @param title {string} - session title
 * @param username {string} - user creating the session; must be valid user
 * @param callback {function} - function to be called with err and result
 */
courseSchema.statics.addSession = function(number, title, username, callback) {
    getCourse(number, function(err, course) {
        if (err) callback(err);
        else {
            Session.create(number, title, username, function(err, newSession) {
                if (err) callback(err);
                else {
                    course.sessions.push(newSession);
                    course.save(function(err) {
                        if (err) callback(err);
                        else newSession.save(function(err, result) {
                            if (err) callback(err);
                            else callback(null, {
                                _id: result._id,
                                number: result.number,
                                title: result.title,
                                createdAt: result.createdAt
                            });
                        });
                    });
                }
            });
        }
    });
}

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;

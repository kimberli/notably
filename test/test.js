var assert = require('assert');
var mongoose = require('mongoose');
var Course = require('../server/models/Course');
var Session = require('../server/models/Session');
var Snippet = require('../server/models/Snippet');
var Stash = require('../server/models/Stash');
var User = require('../server/models/User');

mongoose.connect('mongodb://localhost/model_test',function(){
    mongoose.connection.db.dropDatabase();
    User.createNewUser('kim', 'pass123', 'Kim Zhong', 'kimberli@mit.edu', function() {});
    User.createNewUser('123', 'pass', 'Ben Bitdiddle', 'bendit@mit.edu', function(){});
    User.createNewUser('456', 'pa1242412ss2', 'Alyssa Hacker', 'alyssa@mit.edu', function(){});
    (new Course({
        name: 'Software Studio',
        number: '6.170',
        professor: 'Daniel Jackson',
        description: 'This is a class',
        sessions: []
    })).save();
});

// test user model
describe('User', function() {

    //test findProfile
    describe('#findProfile', function () {
        // test nonexistent user
        it('should return error when user does not exist', function (done) {
            User.findProfile('hello', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test created user
        it('should return username when user exists', function (done) {
            User.findProfile('kim', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, 'kim');
                done();
            });
        });

        // test created user capitalized
        it('should return username when user exists even if capitalized', function (done) {
            User.findProfile('Kim', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, 'kim');
                done();
            });
        });

    });

    //test verifyPassword
    describe('#verifyPassword', function () {

        // test nonexistent user
        it('should return error when user does not exist', function (done) {
            User.verifyPassword('hello', 'hoo', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test incorrect pass
        it('should return error when incorrect password', function (done) {
            User.verifyPassword('kim', 'pass', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test existing user
        it('should not return error when user exists', function (done) {
            User.verifyPassword('kim', 'pass123', function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

        // test existing user different capitalization
        it('should not return error when user exists with different capitalization', function (done) {
            User.verifyPassword('Kim', 'pass123', function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

    });

    //test createNewUser
    describe('#createNewUser', function () {
        // test nonexistent user
        it('should return error when user exists', function (done) {
            User.createNewUser('kim', 'pass', 'name', 'email@mit.edu', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username min length
        it('should return error when username too short', function (done) {
            User.createNewUser('ki', 'pass', 'name', 'email@mit.edu', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username max length
        it('should return error when username too long', function (done) {
            User.createNewUser('kewfewfweewfefwgi', 'pass', 'name', 'email@mit.edu', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username invalid characters
        it('should return error when username has invalid chars', function (done) {
            User.createNewUser('hi<>mi', 'pass', 'name', 'email@mit.edu', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test non-MIT email
        it('should return error when email is non-mit', function (done) {
            User.createNewUser('hief', 'pass', 'name', 'email@test.com', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test non-unique email
        it('should return error when email taken', function (done) {
            User.createNewUser('balggw', 'pass', 'name', 'kimberli@mit.edu', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test new user
        it('should not return error when user does not exist', function (done) {
            User.createNewUser('eek', 'pass', 'name', 'email@mit.edu', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: 'eek'});
                done();
            });
        });

        // test new user capitalized
        it('should not return error when username capitalized', function (done) {
            User.createNewUser('Blah', 'pass', 'name', 'email1@mit.edu', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: 'blah'});
                done();
            });
        });
    });

    //test addCourse
    describe('#addCourse', function () {
        // test adding nonexistent course
        it('should return error when course not found', function (done) {
            User.addCourse('kim', '6170', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test adding course
        it('should not return error when course exists', function (done) {
            User.addCourse('kim', '6.170', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, { courses: [{name: 'Software Studio', number: '6.170'}] });
                done();
            });
        });

        // test adding duplicate course
        it('should return error when course already subscribed to', function (done) {
            User.addCourse('kim', '6.170', function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

    });

    //test getCourses
    describe('#getCourses', function () {
        // test user without subscribed courses
        it('should not return error user has no courses', function (done) {
            User.getCourses('123', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {courses: []});
                done();
            });
        });

        // test adding course
        it('should not return error when user has courses', function (done) {
            User.getCourses('kim', function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, { courses: [{name: 'Software Studio', number: '6.170'}] });
                done();
            });
        });
    });

});

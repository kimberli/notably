// PACKAGES //
var gulp = require('gulp');
var sass = require('gulp-sass');
var toc = require('gulp-doctoc');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var exec = require('child_process').exec;



// MONGO //

// only kill mongo if it was used
var usedMongo = false;

// require only one ctrl+c to exit
process.once('SIGINT', function(){
    if (usedMongo) {
        console.log('\nshutting down mongod...');
        exec('pgrep mongod | xargs kill; kill ' + process.pid);
    } else {
        exec('kill ' + process.pid);
    }
});

// call mongod to start mongo database
var startMongo = function () {
    usedMongo = true;
    exec('mongod');
}



// APP SCRIPTS //

// start the database
gulp.task('startdb', function () {
    startMongo();
});

// run node on the server file
gulp.task('runserver', ['startdb'], function () {
    nodemon({script: 'bin/www'});
});

// run mocha tests
gulp.task('test', ['startdb'], function () {
    gulp.src('test/test.js')
		.pipe(mocha({reporter: 'nyan'}))
        .pipe(exit());
});



// UPDATING //

// install npm dependencies
gulp.task('install', function () {
    exec('npm install');
});

// copy files from node_modules to lib folder
gulp.task('copylib', function () {
    gulp.src('node_modules/materialize-css/dist/**/*')
        .pipe(gulp.dest('client/assets/lib/materialize/'));
});

// run npm update and copy frontend files to lib folder
gulp.task('update', ['install', 'copylib']);



// DEV ENVIRONMENT //

// run doctoc on readme
gulp.task('readme', function () {
    gulp.src('README.md')
        .pipe(toc({title: "**Table of Contents**"}))
        .pipe(gulp.dest('.'));
});

// compile sass files into compressed css file
gulp.task('sass', function () {
    gulp.src('client/assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('client/assets/css'));
});

// watch for file changes while developing
gulp.task('watch', function () {
    gulp.watch('README.md', ['readme']);
    gulp.watch('client/assets/scss/**/*.scss', ['sass']);
});

// start watching for file changes and run server
gulp.task('dev', ['watch', 'runserver']);



// DEFAULT //

gulp.task('default', ['dev']);

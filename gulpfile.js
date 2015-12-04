var gulp = require('gulp');
var sass = require('gulp-sass');
var toc = require('gulp-doctoc');

gulp.task('readme', function(){
    gulp.src('README.md')
        .pipe(toc({title: "**Table of Contents**"}))
        .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {
    gulp.src('client/assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('client/assets/css'));
});

gulp.task('watch', function () {
    gulp.watch('README.md', ['readme']);
    gulp.watch('client/assets/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['readme', 'sass', 'watch']);

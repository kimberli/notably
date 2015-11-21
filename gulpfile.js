var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('client/assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('client/assets/css'));
});

gulp.task('watch', function () {
    gulp.watch('client/assets/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);

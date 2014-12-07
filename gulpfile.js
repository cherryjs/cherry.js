'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src('cherry.js')
        .pipe(uglify())
        .pipe(rename('cherry.min.js'))
        .pipe(gulp.dest('.'));
});
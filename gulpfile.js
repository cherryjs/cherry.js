'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
    gulp.src('cherry.js')
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename('cherry.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('test', function () {

});

gulp.task('lint', function() {
  return gulp.src('cherry.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
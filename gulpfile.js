var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


var jsPath = './app/js/**/*.js';
var cssPath = ['./app/css/**/*.scss', './app/css/**/*.css'];



gulp.task('browserify', function() {
  gulp.src('./app/js/main.js', { read: false })
    .pipe(plumber())
    .pipe(browserify())
    .on("error", notify.onError({
      message: "<%= error.message %>",
      title: "Error"
    }))
    .pipe(rename('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('css', function() {
  gulp.src(cssPath)
    .pipe(plumber())
    .pipe(concat('main.css'))
    .pipe(sass({
      //outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function() {
  gulp.watch(jsPath, ['browserify']);
  gulp.watch(cssPath, ['css']);
});

gulp.task('default', ['css', 'browserify', 'watch']);
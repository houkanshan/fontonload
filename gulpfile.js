var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , ghpages = require('gulp-gh-pages')

gulp.task('jshint', function(){
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter())
})

gulp.task('compress', function(){
  gulp.src(['./fontonload.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'))
})

gulp.task('gh-pages', function () {
  gulp.src(['**/*', '!node_modules/**'])
    .pipe(ghpages());
})

gulp.task('test', ['jshint'])
gulp.task('default', ['jshint', 'compress', 'gh-pages'])

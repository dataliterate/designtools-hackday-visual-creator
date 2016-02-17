var gulp = require('gulp'),
    rename = require('gulp-rename');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Server
var browserSync = require('browser-sync').create();

// Styles
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');

// Scripts
var uglify = require('gulp-uglify');
var browserify = require('browserify');

gulp.task('default', ['watch'], function() {
});

//**************************** Pipelines ****************************//

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function(){
  return browserify('src/scripts/main.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function(){
  gulp.src(['src/imgs/**/*'])
    .pipe(gulp.dest('dist/imgs/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//**************************** Helpers ****************************//

gulp.task('watch', ['browserSync', 'styles', 'scripts', 'images'], function(){
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  });
});

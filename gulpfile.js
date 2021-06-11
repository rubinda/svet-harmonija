/* Needed gulp config */

var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


/* Scripts task */
function serveScripts(cb) {
  gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'js/vendor/jquery.min.js',
    'js/vendor/jquery.easing.1.3.js',
    'js/vendor/jquery.stellar.min.js',
    'js/vendor/jquery.flexslider-min.js',
    'js/vendor/imagesloaded.pkgd.min.js',
    'js/vendor/isotope.pkgd.min.js',
    'js/vendor/jquery.timepicker.min.js',
    'js/vendor/bootstrap-datepicker.js',
    'js/vendor/photoswipe.min.js',
    'js/vendor/photoswipe-ui-default.min.js',
    'js/vendor/owl.carousel.min.js',
    'js/vendor/bootstrap.min.js',
    'js/vendor/jquery.waypoints.min.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
  cb();
}

function minifyCustom(cb) {
   gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'js/custom.js'
        ])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
   cb();
}

/* Sass task */
function serveSass (cb) {
    gulp.src('scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
          errLogToConsole: true,

          //outputStyle: 'compressed',
          // outputStyle: 'compact',
          // outputStyle: 'nested',
          outputStyle: 'expanded',
          precision: 10
        }))

        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))

        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        /* Reload the browser CSS after every change */
        .pipe(browserSync.stream());
    cb();
}

function mergeStyles(cb) {

    gulp.src([
        'css/vendor/bootstrap.min.css',
        'css/vendor/animate.css',
        'css/vendor/icomoon.css',
        'css/vendor/flexslider.css',
        'css/vendor/owl.carousel.min.css',
        'css/vendor/owl.theme.default.min.css',
        'css/vendor/photoswipe.css',
        'css/vendor/jquery.timepicker.css',
        'css/vendor/bootstrap-datepicker.css',
        'css/vendor/default-skin.css',
        'fonts/icomoon/style.css',
        ])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(concat('vendors-merged.css'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
    cb();
}


function serve(cb) {
    browserSync.init(['css/*.css', 'js/*.js'], {
        server: {
            baseDir: './'
        }
    });

    gulp.watch('scss/**/*.scss', serveSass);
    gulp.watch('js/custom.js', minifyCustom);
    gulp.watch('*.html').on('change', browserSync.reload);
    cb();
}

/* Watch scss, js and html files, doing different things with each. */
// gulp.task('default', gulp.series(gulp.parallel('sass', 'scripts', 'browser-sync'), function () {
//     /* Watch scss, run the sass task on change. */
//     gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass'])
//     /* Watch app.js file, run the scripts task on change. */
//     gulp.watch(['js/custom.js'], ['minify-custom'])
//     /* Watch .html files, run the bs-reload task on change. */
//     gulp.watch(['*.html'], browserSync.reload);
// }));


exports.mergeStyles = mergeStyles;
exports.default = gulp.series(serveSass, serveScripts, serve);
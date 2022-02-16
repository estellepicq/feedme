const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const del = require("del");
const browsersync = require("browser-sync").create();

const { src, dest, parallel, series, watch } = require('gulp');

// Directories
const source = './src/';
const destination = './public/';

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean public
function clean() {
  return del(['./public/']);
}

/* CSS */
function css() {
  return src(source + 'scss/*.scss')
    .pipe(concat('styles.scss'))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(destination + 'css'))
    .pipe(browsersync.stream());
}

/* JAVASCRIPT */
function js() {
  return src([
      source + 'js/*.js'
    ])
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true
    }))
    .pipe(concat('main.min.js'))
    .pipe(dest(destination + 'js'))
    .pipe(browsersync.stream());
}

/* BOOTSTRAP & FONT AWESOME & JQUERY BUNDLE */
// CSS VENDOR BUNDLE
function vendorcss() {
  return src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'node_modules/mapbox-gl/dist/mapbox-gl.css'
  ])
    .pipe(concat('vendors.css'))
    .pipe(dest(destination + 'css'));
}

// JS VENDOR BUNDLE
function vendorjs() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/@lcluber/aiasjs/dist/aias.iife.js',
    'node_modules/@dwtechs/checkhard/dist/ch.iife.min.js',
    'node_modules/mapbox-gl/dist/mapbox-gl.js'
  ])
    .pipe(concat('vendors.min.js'))
    .pipe(dest(destination + 'js'));
}

// Font Awesome
function fontawesomefonts() {
  return src([
    './node_modules/@fortawesome/fontawesome-free/webfonts/*'
  ])
    .pipe(dest(destination + 'webfonts'));
}


/* IMAGES */
function img() {
  return src(source + 'img/*.*')
    .pipe(dest(destination + 'img'))
    .pipe(browsersync.stream());
}

/* TASKS */

// Watch files
function watchFiles() {
  watch(source + 'scss/*.scss', css);
  watch(source + 'js/*.js', js);
  watch(source + 'img/*.*', img, browserSyncReload);
  // watch(source + 'html/**', html, browserSyncReload);
}

// Complex tasks
const build = series(clean, parallel(css, js, vendorjs, vendorcss, fontawesomefonts, img));
const serve = series(build, parallel(watchFiles/*, browserSync*/));

exports.css = css;
exports.js = js;
exports.vendorjs = vendorjs;
exports.vendorcss = vendorcss;
exports.fontawesomefonts = fontawesomefonts;
exports.img = img;
exports.clean = clean;
exports.default = build;
exports.build = build;
exports.serve = serve;

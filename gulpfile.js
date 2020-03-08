const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass');
const del = require("del");
const browsersync = require("browser-sync").create();

const { src, dest, parallel, series, watch } = require('gulp');

// Directories
const source = './src/';
const destination = './public/';

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./public/"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean public
function clean() {
  return del(['./public/']);
}

/* HTML */
function html() {
  return src([
    source + 'html/*.html',
    source + 'html/basics/*.html',
    source + 'html/recipes/*.html',
    source + 'html/fodmaps/*.html',
    source + 'html/components/*.html',
  ])
  .pipe(fileInclude({
    prefix: '@@',
    basepath: '@root'
  }))
  .pipe(dest(destination))
  .pipe(browsersync.stream());
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
  return src(source + 'js/*.js')
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true
    }))
    .pipe(dest(destination + 'js'))
    .pipe(browsersync.stream());
}

/* BOOTSTRAP & FONT AWESOME & JQUERY BUNDLE */
// CSS VENDOR BUNDLE
function vendorcss() {
  return src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css'
  ])
    .pipe(concat('vendors.css'))
    .pipe(dest(destination + 'css'));
}

// JS VENDOR BUNDLE
function vendorjs() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/@lcluber/aiasjs/dist/aias.iife.min.js'
  ])
    .pipe(concat('vendors.js'))
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

/* PDF */
function assets() {
  return src(source + 'assets/*.*')
    .pipe(dest(destination + 'assets'))
    .pipe(browsersync.stream());
}

/* TASKS */

// Watch files
function watchFiles() {
  watch(source + 'scss/*.scss', css);
  watch(source + 'js/*.js', js);
  watch(source + 'img/*.*', img);
  watch(source + 'html/**', html, browserSyncReload);
}

// Complex tasks
const build = series(clean, parallel(html, css, js, vendorjs, vendorcss, fontawesomefonts, img, assets));
const serve = series(build, parallel(watchFiles, browserSync));

exports.html = html;
exports.css = css;
exports.js = js;
exports.vendorjs = vendorjs;
exports.vendorcss = vendorcss;
exports.fontawesomefonts = fontawesomefonts;
exports.img = img;
exports.assets = assets;
exports.clean = clean;
exports.default = build;
exports.build = build;
exports.serve = serve;

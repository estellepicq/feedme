  const gulp = require('gulp');
  const rename = require('gulp-rename');
  const cleanCSS = require('gulp-clean-css');
  const minify = require('gulp-minify');
  const concat = require('gulp-concat');

  const { src, dest, parallel, series, watch } = require('gulp');

  // Directories
  const source = './src/';
  const destination = './public/';

  /* CSS */
  function css() {
    return src(source + 'css/styles.css')
      .pipe(cleanCSS())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(dest(destination + 'css'));
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
      .pipe(dest(destination + 'js'));
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
    .pipe(dest(destination + 'img'));
  }

  /* PDF */
  function assets() {
    return src(source + 'assets/*.*')
    .pipe(dest(destination + 'assets'));
  }

  /* TASKS */

  // Watch files
  function watchFiles() {
    watch(source + 'css/*.css', css);
    watch(source + 'js/*.js', js);
    watch(source + 'img/*.*', img);
    watch('index.html');
  }

  exports.css = css;
  exports.js = js;
  exports.vendorjs = vendorjs;
  exports.vendorcss = vendorcss;
  exports.fontawesomefonts = fontawesomefonts;
  exports.img = img;
  exports.assets = assets;
  const dev = parallel(css, js, vendorjs, vendorcss, fontawesomefonts, img, assets);
  exports.default = dev;
  exports.watch = parallel(dev, watchFiles);


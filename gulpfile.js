"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var cheerio = require("gulp-cheerio");
var babel = require('gulp-babel');
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
//var posthtml = require("gulp-posthtml");
//var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("css", function() {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso({ restructure: false }))
    .pipe(rename("style.mini.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// .pipe(csso({restructure: false}))

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran(), //{ progressive: true }
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("rmAttr", function() {
  return gulp.src("source/img/icon-*.svg")
    .pipe(cheerio({
      run: function($) {
        $("[fill]").removeAttr("fill");
        $("[stroke]").removeAttr("stroke");
        $("[style]").removeAttr("style");
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function() {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore()) //{inlineSvg: true}
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});
// .pipe(posthtml([include() ]))

gulp.task("js", function() {
  return gulp.src("source/js/**/*.js")
    .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(sourcemap.write("source/js/"))
    .pipe(gulp.dest("build/js"));
});


gulp.task("copy", function() {
  return gulp.src(
      ["source/fonts/**?*.{woff,woff2}",
        "source/img/**",
        "source/*.ico",
        "source/*.html"
      ], { base: "source" }
    )
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
})

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "js",
  "html"
));

gulp.task("start", gulp.series("build", "server"));

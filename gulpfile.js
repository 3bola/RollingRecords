"use strict";
const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
/* 
	---- Gulp top level functions ----
	1. gulp.task = define tasks for gulp to run
	2. gulp.src = point to the files to use
	3. gulp.dest = point to the folder to output
	4. gulp.watch = watch files and folders for changes
*/

// define gulp tasks
gulp.task("default", () => {
	gulp.src("public/dev_js/*.js")
	.pipe(uglify())
	.pipe(gulp.dest("public/js"));
});
// minify images
gulp.task("imageMin", () => {
	gulp.src("public/dev_images/*")
	.pipe(imagemin([
    	imagemin.gifsicle({interlaced: true}),
    	imagemin.jpegtran({progressive: true}),
    	imagemin.optipng({optimizationLevel: 5})
	]))
	.pipe(gulp.dest("public/images"));
});
// gulp css minifyer
gulp.task("cssMin", () => {
	gulp.src("public/dev_css/*.css")
	.pipe(cssmin())
	.pipe(gulp.dest("public/css"));
});
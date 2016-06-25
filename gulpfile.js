'use strict';
var gulp = require('gulp'),
sass = require('gulp-sass'),
changed = require('gulp-changed'),
cached = require('gulp-cached'),
gulpif = require('gulp-if'),
filter = require('gulp-filter'),
autoprefixer = require('gulp-autoprefixer'),
server = require('gulp-server-livereload'),
cleanCSS = require('gulp-clean-css'),
path = require('path'),
wiredep = require('wiredep').stream,
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
del = require('del'),
htmlmin = require('gulp-htmlmin');


//Server-livereload

gulp.task('server', function() {
	gulp.src('app')
	.pipe(server({
		livereload: true,
		defaultFile: 'index.html',
		open: true
	}));
});

// Sass compiler

gulp.task('sass', function () {
	return gulp.src('app/sass/*.+(scss|sass)')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
	browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
	cascade: false
	}))
	.pipe(gulp.dest('app/css'));
});



//Sass Wathing functions

gulp.task('setWatch', function() {
	global.isWatching = true;
});


//Images
gulp.task('images', function(){
	return gulp.src('app/img/**/*')
	.pipe(imagemin({
		progressive: true,
		optimizationLevel: 7
	}))
	.pipe(gulp.dest('build/img'));
});


//Bower
gulp.task('bower', function () {
	gulp.src('app/*.html')
	.pipe(wiredep({
		directory: 'app/bower_components'
	}))
	.pipe(gulp.dest('app'));
});


//Watch
gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);

});

//Work
gulp.task('work', ['server', 'watch']);

//Clean bild

gulp.task('clean', function(){
return del.sync('build/**/*')

	});

//Build
gulp.task('build', ['clean','images','sass'], function () {
	return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', cleanCSS({compatibility: 'ie8'})))
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('build'));
	gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('build/fonts'));
	});

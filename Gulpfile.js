var gulp = require('gulp');  
var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');  

var isDevelopment = (process.env.NODE_ENV || "development") === "development";
var buildDir = isDevelopment ? "build/development" : "build/production";

gulp.task('script', function() {  
	return gulp.src(['script/main.js'])
	.pipe(browserify({
		debug: isDevelopment
	}))
	.pipe(concat('main.js'))
	.pipe(gulp.dest(buildDir));
});

gulp.task('build', ['script']);

gulp.task('watch', ['build'], function() {
	gulp.watch('node_modules/**/*.js', ['script']);
	gulp.watch('script/**/*.js', ['script']);
});


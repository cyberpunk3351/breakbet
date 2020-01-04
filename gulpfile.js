var gulp                = require('gulp'); 
var browserSync         = require('browser-sync').create();
var sass                = require('gulp-sass');
var notify              = require("gulp-notify");
var pug 		        = require('gulp-pug');
var rename 		        = require('gulp-rename');
var autoprefixer 		= require('gulp-autoprefixer');
var gcmq 	  	 	    = require('gulp-group-css-media-queries');


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
	});
});

gulp.task('styles', function() {
	// return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	return gulp.src('src/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 5 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('src/css')) // папака в которую складывают уже готовые css стили
	.pipe(browserSync.stream())
});

gulp.task('pug', function(){
    return gulp.src(['src/pug/*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('gcmq', async function () {
    gulp.src('src/css/main.min.css')
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('copy-img', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./dist/imgs'));
});

gulp.task('copy-css', function() {
    return gulp.src('./src/css/**/*.*')
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-font', function() {
    return gulp.src('./src/fonts/**/*.{woff,woff2,eot}')
        .pipe(gulp.dest('./dist/fonts'));
});
gulp.task('copy-js', function() {
    return gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
    gulp.watch(['src/sass/**/*.sass', './src/pug/modules/**/*.sass'], gulp.parallel('styles'));
    gulp.watch(['src/css/main.min.css'], gulp.parallel('gcmq'));
	gulp.watch('src/pug/**/*.pug', gulp.parallel('pug'));
	gulp.watch('src/css/**/*.css', gulp.parallel('copy-css'));
	gulp.watch('src/js/**/*.js', gulp.parallel('copy-js'));
	gulp.watch('src/img/**/*.{jpg,png,svg}', gulp.parallel('copy-img'));
	gulp.watch('src/fonts/**/*.{woff,woff2,eot}', gulp.parallel('copy-font'));
});

gulp.task('default', gulp.parallel('styles', 'gcmq', 'pug', 'browser-sync', 'watch'));
gulp.task('default1', gulp.parallel('styles', 'copy-img', 'copy-font', 'gcmq', 'pug', 'browser-sync', 'watch'));
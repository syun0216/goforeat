    'use strict';
var path = './';
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var jade = require('gulp-jade');

// Static Server + watching scss/redpacket files
gulp.task('serve', ['sass','jade'], function() {
    
    browserSync.init({
     port: 9999,
        server: path
    });

    gulp.watch(path + "/scss/*.scss", ['sass']);
    // gulp.watch("songshui/jade/*.jade",['jade']);
    gulp.watch(path + "/*.jade",['jade']);
    gulp.watch(path + "/*.*").on('change', browserSync.reload);
    gulp.watch(path + "/**/*.*").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(path +"/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(path + "/css"))
        .pipe(browserSync.stream());
});

gulp.task('jade',function(){
    return gulp.src(path + "/*.jade")
       // .pipe(changed(config.dist,{extension:'.html'}))
        .pipe(jade())
        .pipe(gulp.dest(path))
        .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);


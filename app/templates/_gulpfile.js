var gulp = require('gulp')

//--GULP PLUGINS----------------------------------------------------------------------
var mainBowerFiles  = require('main-bower-files')
var inject          = require("gulp-inject");
var replace         = require('gulp-replace');
var chalk           = require('chalk');
var runSequence     = require('run-sequence');
var notify          = require("gulp-notify");






//--DEV TASKS-------------------------------------------------------------------------

// Remove 3rd party bower dependencies (scripts/links)
gulp.task('cleanBowerDepends', function() {

    // regex pattern
    var regexBowerCss   = /<!-- bower:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexBowerJs    = /<!-- bower:js -->([\s\S]*?)<!-- endinject -->/g;

    // clean tags
    var cleanBowerCss   = "<!-- bower:css -->\n\t<!-- endinject -->";
    var cleanBowerJs    = "<!-- bower:js -->\n<!-- endinject -->";

    return gulp.src(['./webClient/index.html'])
		       .pipe(replace(regexBowerCss, cleanBowerCss))
		       .pipe(replace(regexBowerJs, cleanBowerJs))
		       .pipe(gulp.dest('./webClient/'))
});


//--Inject all the Bower Dependencies
gulp.task('injectBower', function () {
    return gulp.src('./webClient/index.html')
               .pipe(inject(
                    gulp.src(mainBowerFiles({}), {read: false}),  {name: 'bower'}
               ))
               .pipe(replace('/webClient/', ''))
               .pipe(gulp.dest('./webClient'))
});

//--Remove all 3rd party dependencies and reinject them
gulp.task('bower', function(callback) {
    runSequence('cleanBowerDepends',['injectBower'], function(){

      var sendMessage = "finished cleaning and installing all your bower dependencies!";

      return gulp.src('./webClient/index.html')
                 .pipe(notify(sendMessage));
    
  });
});






//--BUILD TASKES----------------------------------------------------------------------











//--DEV-SERVER------------------------------------------------------------------------





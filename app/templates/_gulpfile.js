var gulp = require('gulp')

//--GULP PLUGINS----------------------------------------------------------------------
var mainBowerFiles  = require('main-bower-files')
var inject          = require("gulp-inject");
var replace         = require('gulp-replace');
var chalk           = require('chalk');
var runSequence     = require('run-sequence');
var notify          = require("gulp-notify");







//--DEV TASKS-------------------------------------------------------------------------

//--Remove all Bower dependency tags in the index.html file(scripts/links)
gulp.task('cleanBowerTags', function() {

    // regex 3rd party
    var regexBowerCss   = /<!-- bower:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexBowerJs    = /<!-- bower:js -->([\s\S]*?)<!-- endinject -->/g;

    // clean 3rd party tags
    var cleanBowerCss   = "<!-- bower:css -->\n\t<!-- endinject -->";
    var cleanBowerJs    = "<!-- bower:js -->\n<!-- endinject -->";

    return gulp.src(['./webClient/index.html'])
           .pipe(replace(regexBowerCss, cleanBowerCss))
           .pipe(replace(regexBowerJs, cleanBowerJs))
           .pipe(gulp.dest('./webClient/'))
});
//--Inject: all Bower dependency tags in the index.html file(scripts/links)
gulp.task('injectBowerTags', function () {
    return gulp.src('./webClient/index.html')
               .pipe(inject(
                    gulp.src(mainBowerFiles({}), {read: false}),  {name: 'bower'}
               ))
               .pipe(replace('/webClient/', ''))
               .pipe(gulp.dest('./webClient'))
});


//--Remove client-side files tags in the index.html file (scripts/links)
gulp.task('cleanClientTags', function() {

    // regex client
    var regexInjectCss  = /<!-- inject:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexInjectJs   = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/g;

    // clean tags
    var cleanInjectCss  = "<!-- inject:css -->\n\t<!-- endinject -->";
    var cleanInjectJs   = "<!-- inject:js -->\n\<!-- endinject -->";

    return gulp.src(['./webClient/index.html'])
           .pipe(replace(regexInjectCss, cleanInjectCss))
           .pipe(replace(regexInjectJs, cleanInjectJs))
           .pipe(gulp.dest('./webClient/'))
});
//--Inject client-side files tags in the index.html file (scripts/links)
gulp.task('injectClientTags', function () {
    var filterDevContent = [
        './webClient/app/*.js',
        './webClient/app/*.css',

        './webClient/app/**/*.js',
        '!./webClient/app/**/*.spec.js',

        './webClient/app/ui-components/**/*.js',
        '!./webClient/app/ui-components/**/*.spec.js',
    ];

    return gulp.src('./webClient/index.html')
               .pipe(inject(
                  gulp.src(filterDevContent, {read: false})
               ))
               .pipe(gulp.dest('./webClient'))
});

















//--BUILD TASKES----------------------------------------------------------------------

//--Cleanup all the script/style tags in the index.html file
gulp.task('cleanTags', function(callback) {
    runSequence(['cleanClientTags','injectClientTags'],['cleanBowerTags','injectBowerTags'], function(){

      var sendMessage = "Finished cleaning/re-injecting client-side and Bower tags into the index.html";

      return gulp.src('./webClient/index.html')
                 .pipe(notify(sendMessage));
  });
});

//--Remove all the script/style tags in the index.html file
gulp.task('xx', function(callback) {
    runSequence('cleanClientTags','cleanBowerTags', function(){

      var sendMessage = "You shouldn't have anymore Bower/client-side scripts/css tags in your index.html file!";

      return gulp.src('./webClient/index.html')
                 .pipe(notify(sendMessage));
  });
});










//--DEV-SERVER------------------------------------------------------------------------





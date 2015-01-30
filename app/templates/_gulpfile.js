var gulp = require('gulp')
var fs   = require("fs");

//--GULP PLUGINS----------------------------------------------------------------------
var mainBowerFiles  = require('main-bower-files')
var inject          = require("gulp-inject");
var replace         = require('gulp-replace');
var chalk           = require('chalk');
var runSequence     = require('run-sequence');
var notify          = require("gulp-notify");
var print           = require("gulp-print");
var globby          = require('globby');





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
               .pipe(print())
               .pipe(gulp.dest('./webClient'))
});

//--Inject client-side css @imports into the webClient/app/app.css
gulp.task('injectCss', function () {

  // inject css into the /app/app.css
  var cssFile = __dirname+'/webClient/app/app.css';
  
  fs.readFile(cssFile, 'utf8', function(err, data) {
    if (err) {
      console.log(chalk.red("./app/app.css seems to be missing??"));
    } else {

      // find the content between inject:cssimports
      var re = /inject:cssimports \*\/\n([\s\S]*?)\/\* endinject/;
      var match = data.match(re);

      // find all css files
      var findFile = [
        'webClient/app/**/*.css',
        '!webClient/app/app.css'
      ];

      var newContent = "";
      globby(findFile, function (err, paths) {
          for (i in paths){
            // wrap each file with @import statement
            if (i != paths.length-1){
              var newPath = '@import url("'+paths[i].replace('webClient/app','.')+'");\n';
            } else {
              var newPath = '@import url("'+paths[i].replace('webClient/app','.')+'");';
            }
            newContent += newPath
          }
          newContent = "inject:cssimports */\n"+newContent+"\n/* endinject";

          var newData = data.replace(match[0], newContent);
          fs.writeFile(cssFile, newData, function(err){
            if (err) throw err;
            console.log(chalk.green('injected into /app/app.css ') );
          });
      });//globby

    }//no error
  });// fs.readFile
});












//--BUILD TASKES----------------------------------------------------------------------

//--Cleanup all the script/style tags in the index.html file
gulp.task('cleanTags', function(callback) {
    runSequence(['cleanClientTags','injectClientTags'],['cleanBowerTags','injectBowerTags'],'injectCss', function(){

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





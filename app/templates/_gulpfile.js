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
var nodemon         = require('gulp-nodemon');
var livereload      = require('gulp-livereload');
var open            = require('gulp-open');
var plumber         = require('gulp-plumber');


//--DEV TASKS-------------------------------------------------------------------------

//--Remove all Bower dependency tags in the index.html file(scripts/links)
gulp.task('cleanBowerTags', function() {
    // regex 3rd party
    var regexBowerCss   = /<!-- bower:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexBowerJs    = /<!-- bower:js -->([\s\S]*?)<!-- endinject -->/g;
    // clean 3rd party tags
    var cleanBowerCss   = "<!-- bower:css -->\n\t<!-- endinject -->";
    var cleanBowerJs    = "<!-- bower:js -->\n<!-- endinject -->";
    return gulp.src(['./www/index.html'])
    .pipe(plumber())
           .pipe(replace(regexBowerCss, cleanBowerCss))
           .pipe(replace(regexBowerJs, cleanBowerJs))
           .pipe(gulp.dest('./www/'))
});
//--Inject: all Bower dependency tags in the index.html file(scripts/links)
gulp.task('injectBowerTags', function () {
    return gulp.src('./www/index.html')
    .pipe(plumber())
               .pipe(inject(
                    gulp.src(mainBowerFiles({}), {read: false}),  {name: 'bower'}
               ))
               .pipe(replace('/www/', ''))
               .pipe(gulp.dest('./www'))
});


//--Remove client-side files tags in the index.html file (scripts/links)
gulp.task('cleanClientTags', function() {
    // regex client
    var regexInjectCss  = /<!-- inject:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexInjectJs   = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/g;
    // clean tags
    var cleanInjectCss  = "<!-- inject:css -->\n\t<!-- endinject -->";
    var cleanInjectJs   = "<!-- inject:js -->\n\<!-- endinject -->";

    return gulp.src(['./www/index.html'])
           .pipe(replace(regexInjectCss, cleanInjectCss))
           .pipe(replace(regexInjectJs, cleanInjectJs))
           .pipe(gulp.dest('./www/'));
});
//--Inject client-side files tags in the index.html file (scripts/links)
gulp.task('injectClientTags', function () {
    var filterDevContent = [
        './www/app/*.js',
        './www/app/*.css',
        './www/app/**/*.js',
        '!./www/app/**/*.spec.js',
        './www/app/ui-components/**/*.js',
        '!./www/app/ui-components/**/*.spec.js',
    ];

    return gulp.src('./www/index.html')
    .pipe(plumber())
               .pipe(inject(
                  gulp.src(filterDevContent, {read: false})
               ))
               .pipe(replace('/www/', ''))
               .pipe(gulp.dest('./www'))
});


//--Inject client-side css @imports into the www/app/app.css
gulp.task('injectCss', function () {

  // inject css into the /app/app.css
  var cssFile = __dirname+'/www/app/app.css';
  fs.readFile(cssFile, 'utf8', function(err, data) {
    if (err) {
      console.log(chalk.red("./app/app.css seems to be missing??"));
    } else {
      // find the content between inject:cssimports
      var re = /inject:cssimports \*\/\n([\s\S]*?)\/\* endinject/;
      var match = data.match(re);

      // find all css files
      var findFile = [
        'www/app/**/*.css',
        '!www/app/app.css'
      ];
      var newContent = "";
      globby(findFile, function (err, paths) {
          for (i in paths){
            // wrap each file with @import statement
            if (i != paths.length-1){
              var newPath = '@import url("'+paths[i].replace('www/app','.')+'");\n';
            } else {
              var newPath = '@import url("'+paths[i].replace('www/app','.')+'");';
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
gulp.task('cleantags', function(callback) {
    runSequence(
      'cleanClientTags',
      'injectClientTags',
      'cleanBowerTags',
      'injectBowerTags',
      'injectCss',
      function(){
        var sendMessage = "Finished cleaning/re-injecting client-side and Bower tags into the index.html";
        return gulp.src('./www/index.html')
        .pipe(plumber())
                   .pipe(notify(sendMessage));
      });
});
gulp.task('build', function(callback) {

});




//--WATCH-----------------------------------------------------------------------
gulp.task('watch', function() {
  livereload.listen({ start: true });
  var watchFiles = [
    'www/index.html',
    'www/app/app.css',
    'www/app/**/*.html',
    'www/app/**/*.css',
    'www/app/**/*controller.js',
    'www/app/services/*.js',
    'www/app/ui-components/**/*.css',
    'www/app/ui-components/**/*.controller.js',
    'www/app/ui-components/**/*.html',
    'server/package.json'
  ];
  gulp.watch(watchFiles, ['index']);
  gulp.watch('bower.json', ['cleanTags']);
});
gulp.task('index', function() {
  return gulp.src('www/index.html')
  .pipe(plumber())
             .pipe(livereload());
});




//--DEV-SERVER------------------------------------------------------------------------
gulp.task('open', function(){
    function openBrowserApp(openApp){
      if (openApp == "osx-chrome"){
        return '/Applications/Google Chrome.app';
      } else if (openApp == "linux-chrome"){
        return 'google-chrome';
      } else if (openApp == "windows-chrome"){
        return 'chrome';
      } else if (openApp == "osx-firefox"){
        return '/Applications/firefox.app';
      }
    }
    var options = {
      url: 'http://localhost:8080',
      app: openBrowserApp("osx-chrome")
    };
    gulp.src('./www/index.html')
        .pipe(open('', options));
});
gulp.task('express', function() {
    var serverPath = __dirname+'/server/server.js';
    nodemon({ script: serverPath });
});
gulp.task('serve',  function() {
    runSequence(
      'cleanClientTags',
      'injectClientTags',
      'cleanBowerTags',
      'injectBowerTags',
      'injectCss',
      'express',
      'watch',
      'open',
      function(){
        console.log("....The magic happens on port: 8080!");        
        return gulp.src('./www/index.html');
      });
});
gulp.task('default',  function() {
    runSequence(
      'cleanClientTags',
      'injectClientTags',
      'cleanBowerTags',
      'injectBowerTags',
      'injectCss',
      'express',
      'watch',
      function(){
        console.log("....The magic happens on port: 8080!");        
        return gulp.src('./www/index.html');
      });
});

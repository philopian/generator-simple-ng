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
        return gulp.src('./www/index.html');
      });
});








//--BUILD DISTRIBUTION - ADDITIONAL GULP PLUGINS----------------------------------------------------------------------
var clean             = require('gulp-clean');
var rename            = require("gulp-rename");
var concat            = require('gulp-concat')
var minifyCSS         = require('gulp-minify-css');
var mainBowerFiles    = require('main-bower-files')
var gulpFilter        = require('gulp-filter');
var order             = require('gulp-order')
var uglifycss         = require('gulp-uglifycss');
var stripCssComments  = require('gulp-strip-css-comments');
var minifyCss         = require('gulp-minify-css');
var uglify            = require('gulp-uglify');
var ngAnnotate        = require('gulp-ng-annotate');
var flatten           = require('gulp-flatten');
var minifyHTML        = require('gulp-minify-html')
var htmlreplace       = require('gulp-html-replace');


//--Individual BUILD TASKES---------------------------------------------------------------------------

// start a new dist folder from scratch
gulp.task('dist-clean', function() {    
    return gulp.src('./dist/*')
                .pipe(clean({force: true}));
});

// Remove all the imports in the www/app/app.css & rename to ./dist/app/app.css & add @import url("./base.css");
gulp.task('buildAppCss', function() {
  var regexRemoveCss    = /\/\* inject:cssimports \*\/([\s\S]*?)\/\* endinject \*\//g;
  var cleanAddCss       = '@import url("./base.css");';
  return gulp.src(['./www/app/app.css'])
              .pipe(replace(regexRemoveCss, cleanAddCss))
              .pipe(rename(function (path) {
                path.basename = "app";
                path.extname = ".css"
              }))
              .pipe(gulp.dest('./dist/app/css/'));
});

//--Create app's css (take all the .css files and make one files called ./dist/app/app.css)
gulp.task('concateCss', function() {
    return gulp.src([
                  './www/app/app.css',
                  './www/app/**/*.css',
                  './www/app/view/**/*.css',
                  './www/app/ui-components/**/*.css'
                ])
                .pipe(concat('base.css'))
                .pipe(minifyCSS())
                .pipe(gulp.dest('./dist/app/css/'));
});

// Bower CSS - create a vendors.css file
gulp.task('buildBowerCss', function() {
    var bowerOptions = {
        paths: {
            bowerrc: '.bowerrc'
        }
    }
    var regexRemoveCss    = /\/\*!([\s\S]*?)\*\//g;
    var cleanAddCss       = '';
    var cssFiles = 'www/bower_components/*';
    return gulp.src(mainBowerFiles(bowerOptions))
                .pipe(gulpFilter('*.css'))
                .pipe(order([
                    'normalize.css',
                    '*'
                ]))
                .pipe(concat('vendors.css'))
                .pipe(stripCssComments())
                .pipe(replace(regexRemoveCss, cleanAddCss))
                // .pipe(uglifycss())
                // .pipe(minifyCss())
                .pipe(gulp.dest('./dist/app/css'));
});

// Copy Bower Fonts
gulp.task('copyBowerFonts', function() {
        var fontFilter  = gulpFilter(['*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']);
        return gulp.src(mainBowerFiles())
        .pipe(fontFilter)
        .pipe(flatten())
        .pipe(gulp.dest('dist/app/fonts'));
});

// Bower JS - create a vendors.js file
gulp.task('buildBowerJs', function() {
  var jsFiles = ['/www/bower_components/*'];
  var regexRemoveCss    = /\/\*!([\s\S]*?)\*\//g;
  var cleanAddCss       = '';
    return gulp.src(mainBowerFiles().concat(jsFiles))
                .pipe(gulpFilter('*.js'))
                .pipe(concat('vendors.js'))
                .pipe(replace(regexRemoveCss, cleanAddCss))
                .pipe(uglify())
                .pipe(gulp.dest('./dist/app/js'));
});

// Angularjs - minify your code
gulp.task('buildNg', function () {
    var sourceFiles =[
        '!www/bower_components/**',
        '!www/**/*spec.js',
        '!www/views/**/*spec.js',
        '!www/ui-components/**/*spec.js',
        '!www/directives/**/*spec.js',

        'www/**/app.js',
        'www/**/*.js',
        'www/views/**/*.js',
        'www/ui-components/**/*.js',
        'www/directives/**/*.js',
        'www/services/**/*.js',
    ];
    return gulp.src(sourceFiles)
                .pipe(concat('./js/app.js'))
                .pipe(ngAnnotate())
                .pipe(uglify())
                .pipe(gulp.dest('dist/app'))
});

// HTML Minification
gulp.task('buildMinHtml', function() {  
    var opts = {
        comments:false,
        quotes:true,
        spare:true,
        empty:true
    };
    return gulp.src([
      '!www/bower_components/**',
      '!./www/index.html', 
      'www/**/*.html',
      'www/views/**/*.html',
      'www/ui-components/**/*.html',
      'www/directives/**/*.html',
    ])
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'))
});

// Remove the injected dependencies (Remove all the bower:css/endinject, inject:css/endinject, bower:js/endinject, inject:js/endinject)
gulp.task('buildIndexHtml', function() {
    var opts = {
        comments:true,
        spare:true,
        empty:true
    };
    var regexInjectTags = /<!-- inject:([\s\S]*?)<!-- endinject -->/g;
    var regexBowerTags = /<!-- bower:([\s\S]*?)<!-- endinject -->/g
    return gulp.src('./www/index.html')
        .pipe(htmlreplace({
            'css': ['<link rel="stylesheet" href="./app/css/vendors.css">','<link rel="stylesheet" href="./app/css/app.css">'] ,
            'js':  ['<script src="./app/js/vendors.js"></script>','<script src="./app/js/app.js"></script>']
        }))
        .pipe(replace(regexInjectTags, ''))
        .pipe(replace(regexBowerTags, ''))
        // .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/'));
});

// Copy dev assest folder to the dist folder
gulp.task('copyassets',function(){
  var files =[
    './www/assets/*',
    './www/assets/**/*'
  ]
  return gulp.src(files)
              .pipe(gulp.dest('./dist/assets'));
});

// Copy additional vender images to dist
gulp.task('copyVenderImages',function(){
  var files = ['www/bower_components/**/dist/images/*']
  return gulp.src(files)
              .pipe(flatten())
              .pipe(gulp.dest('./dist/app/css/images'));
});

// copy favicon
gulp.task('copyfavicon',function(){
  return gulp.src('favicon.ico')
    .pipe(gulp.dest('./dist'));
});


//--BUILD-----------------------------------------------------------------------
// * build-clean (clear everything in the dist folder and start from stratch!)
// * css app.css (remove all the inject tags from the app.css and add the @import url("./base.css");)
// * css base.css (concatenate all the css and create a ./app/base.css)
// * build vendors.css from all bower dependencies
// * build vendors.js from all bower dependencies
// * copy fonts from dev 
// * concate/min all the angular files and make a app.js
// * cleanup and copy all the html files
// * copy the assets directory to dist
// * copy the favicon to the dist
gulp.task('build', function() {
    runSequence(
        'dist-clean', [
            'buildAppCss',
            'concateCss',
            'buildBowerCss',
            'buildBowerJs',
            'copyBowerFonts',
            'buildNg',
            'buildMinHtml',
            'copyassets',
            'copyfavicon'
        ],
        'buildIndexHtml'
        );
});



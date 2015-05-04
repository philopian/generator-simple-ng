'use strict';
var util 	  = require('util');
var fs 		  = require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		  = require('lodash');
var chalk   = require('chalk');
var globby  = require('globby');


// globals
var appParams = {};
var dupRoute = false;
var routePlaceholderValues = {};


var SimpleNgGenerator = yeoman.generators.NamedBase.extend({


  initializing: function () {
    this.log('Wait a couple secs while we build out your "' + this.name + '" route files.');
  },


  getParams: function() {
    // define variables
    appParams.destDirPath = this.env.cwd;
    appParams.userDefinedNgModuleName = this.appname;
    if (this.appname.slice(-3) == "App") {
      appParams.ngModuleName = this._.camelize(appParams.userDefinedNgModuleName);
    } else {
      appParams.ngModuleName = this._.camelize(appParams.userDefinedNgModuleName) + "App";
    }
    appParams.userDefinedRouteName = this.name;
    appParams.ngRouteName = this._.camelize(appParams.userDefinedRouteName);
    appParams.ngRouteUrlName = "/" + appParams.ngRouteName;
    appParams.ngControllerName = _.capitalize(appParams.ngRouteName + "Ctrl");

    // define some placeholder variables
    routePlaceholderValues = {
      NG_APP_NAME: appParams.ngModuleName,
      ROUTE_NAME: appParams.ngRouteName,
      CONTROLLER_NAME: appParams.ngControllerName,
      ROUTE_URL_NAME: appParams.ngRouteUrlName
    }

    // check to see if route directory already exist
    var routePath = appParams.destDirPath+"/www/app/views/"+appParams.ngRouteName;
    fs.exists(routePath, function(exists) {
      if (exists) {
        dupRoute = true;
        console.log(chalk.red("*** there already seems to be a route with that name, please choose another route name."));
      }//if dir exist
    });

    var indexHtmlFile = appParams.destDirPath+'/www/index.html';
    fs.exists(indexHtmlFile, function(exists) {
      if (!exists) {
        dupRoute = true;
        console.log(chalk.red("*** Route not created, please run this command at the root of this application"));
      }//if dir exist
    });
  },


  getCopyTemps: function() {
    if (!dupRoute) {
      // CHECK TO SEE IF THE ROUTE DOESN'T ALREADY EXIST!!
      var baseRoutePath = appParams.destDirPath+"/www/app/views/"+appParams.ngRouteName;

      // copy template to dest dir
      this.copy(
        "newRoute/_newRoute.css",
        baseRoutePath+"/"+appParams.ngRouteName+".css"
      );
      this.template(
        "newRoute/_newRoute.controller.js",
        baseRoutePath+"/"+appParams.ngRouteName+".controller.js" ,
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.controller.spec.js",
        baseRoutePath+"/"+appParams.ngRouteName+".controller.spec.js",
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.html",
        baseRoutePath+"/"+appParams.ngRouteName+".html",
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.js",
        baseRoutePath+"/"+appParams.ngRouteName+".js",
        routePlaceholderValues
      );
    }//!dupRoute
  },



  injectScripts: function(){
    if (!dupRoute) {
      // inject js (controller.js/.js) into the index.html
      var indexHtmlFile = appParams.destDirPath+'/www/index.html';
      fs.exists(indexHtmlFile, function(exists) {
        if (exists) {
          fs.readFile(indexHtmlFile, 'utf8', function(err, data) {
            // find substring to update
            var re = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/m
            var contentsToUpdate = data.match(re)[1];

            // new content
            var scriptJs = '<script src="app/views/' + appParams.ngRouteName + '/' + appParams.ngRouteName + '.js"></script>';
            var scriptControllerJs = '<script src="app/views/' + appParams.ngRouteName + '/' + appParams.ngRouteName + '.controller.js"></script>';
            var scriptsToAdd = scriptJs + '\n' + scriptControllerJs + '\n';

            // append new content
            var newContentToUpdate = contentsToUpdate + scriptsToAdd;

            // update the html file
            var newHtmlContent = data.replace(contentsToUpdate, newContentToUpdate);

            fs.writeFile(indexHtmlFile, newHtmlContent, function (err) {
              if (err) throw err;
              console.log(chalk.green('injected into index.html '), scriptJs);
              console.log(chalk.green('injected into index.html '), scriptControllerJs);
            });
          });// fs.readFile

        } else{
          console.log(chalk.red("./index.html seems to be missing??"));
        }
      });//fs.exists
    }//!dupRoute
  },



  injectCss: function(){
    if (!dupRoute) {
      // inject css into the /app/app.css
      var cssFile = appParams.destDirPath+'/www/app/app.css';

      fs.readFile(cssFile, 'utf8', function(err, data) {
        if (err) {
          console.log(chalk.red("./app/app.css seems to be missing??"));
        } else {

          // find the content between inject:cssimports
          var re = /inject:cssimports \*\/\n([\s\S]*?)\/\* endinject/;
          var match = data.match(re);

          // find all css files
          var findFile = [
            appParams.destDirPath+'/www/app/views/**/*.css',
            '!'+appParams.destDirPath+'/www/app/app.css'
          ];

          var newContent = "";
          globby(findFile, function (err, paths) {
              for (var i in paths){
                // wrap each file with @import statement
                if (i != paths.length-1){
                  var newPath = '@import url("'+paths[i].replace(appParams.destDirPath+'/www/app','.')+'");\n';
                } else {
                  var newPath = '@import url("'+paths[i].replace(appParams.destDirPath+'/www/app','.')+'");';
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
    }//!dupRoute
  }






});

module.exports = SimpleNgGenerator;

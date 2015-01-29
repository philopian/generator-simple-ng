'use strict';
var util 	  = require('util');
var fs 		  = require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		  = require('lodash');
var chalk   = require('chalk');



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
    appParams.ngModuleName = this._.camelize(appParams.userDefinedNgModuleName) + "App";
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
    var routePath = appParams.destDirPath+"/app/"+appParams.ngRouteName;
    fs.exists(routePath, function(exists) {
      if (exists) {
        dupRoute = true;
        console.log(chalk.red("..*** there already seems to be a route with that name"));
      }//if dir exist
    });
  },


  getCopyTemps: function() {

    if (!dupRoute) {

      // CHECK TO SEE IF THE ROUTE DOESN'T ALREADY EXIST!!
      var basePath = appParams.destDirPath+"/app/"+appParams.ngRouteName;

      // copy template to dest dir
      this.copy(
        "newRoute/_newRoute.css",
        basePath+"/"+appParams.ngRouteName+".css"
      );
      this.template(
        "newRoute/_newRoute.controller.js",
        basePath+"/"+appParams.ngRouteName+".controller.js" ,
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.controller.spec.js",
        basePath+"/"+appParams.ngRouteName+".controller.spec.js",
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.html",
        basePath+"/"+appParams.ngRouteName+".html",
        routePlaceholderValues
      );
      this.template(
        "newRoute/_newRoute.js",
        basePath+"/"+appParams.ngRouteName+".js",
        routePlaceholderValues
      );
    }

  },



  injectScripts: function(){

    if (!dupRoute) {

      // inject js (controller.js/.js) into the index.html
      var indexHtmlFile = appParams.destDirPath+'/index.html';
      fs.exists(indexHtmlFile, function(exists) {
        if (exists) {
          fs.readFile(indexHtmlFile, 'utf8', function(err, data) {
            // find substring to update
            var re = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/m
            var contentsToUpdate = data.match(re)[1];

            // new content
            var scriptJs = '<script src="./app/' + appParams.ngRouteName + '/' + appParams.ngRouteName + '.js"></script>';
            var scriptControllerJs = '<script src="./app/' + appParams.ngRouteName + '/' + appParams.ngRouteName + '.controller.js"></script>';
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

    }//dupCheck

  },



  injectCss: function(){

    if (!dupRoute) {

      // inject css into the /app/app.css
      var cssFile = appParams.destDirPath+'/app/app.css';
      fs.readFile(cssFile, 'utf8', function(err, data) {
        if (err) {
          console.log(chalk.red("./app/app.css seems to be missing??"));
        } else {
          var linkCss = '@import url("./'+appParams.ngRouteName+'/'+appParams.ngRouteName+'.css");';
          data += '\n'+linkCss+'\n';

          fs.writeFile(cssFile, data, function(err){
            if (err) throw err;
            console.log(chalk.green('injected into /app/app.css '), linkCss );
          });
        }
      });// fs.readFile
    }

  }


});

module.exports = SimpleNgGenerator;
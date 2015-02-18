'use strict';
var util 	  = require('util');
var fs 		  = require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		  = require('lodash');
var chalk   = require('chalk');
var globby  = require('globby');


// globals
var appParams = {};
var dupCtrl = false;
var routePlaceholderValues = {};


var SimpleNgGenerator = yeoman.generators.NamedBase.extend({


  initializing: function () {
    this.log('Wait a couple secs while we build out your "' + this.name + '" controller files.');
  },


  getParams: function() {
    // define variables
    appParams.destDirPath = this.env.cwd;
    appParams.userDefinedNgModuleName = this.appname;
    appParams.ngModuleName = this._.camelize(appParams.userDefinedNgModuleName) + "App";
    appParams.userDefinedCtrlName = this.name;
    appParams.ngCtrlName = this._.camelize(appParams.userDefinedCtrlName);
    appParams.ngControllerName = _.capitalize(appParams.ngCtrlName + "Ctrl");

    // define some placeholder variables
    routePlaceholderValues = {
      NG_APP_NAME: appParams.ngModuleName,
      CONTROLLER_NAME: appParams.ngControllerName,
    }

    // check to see if route directory already exist
    var routePath = appParams.destDirPath+"/webClient/app/"+appParams.ngCtrlName;
    fs.exists(routePath, function(exists) {
      if (exists) {
        dupCtrl = true;
        console.log(chalk.red("*** there already seems to be a route with that name, please choose another route name."));
      }//if dir exist
    });

    var indexHtmlFile = appParams.destDirPath+'/webClient/index.html';
    fs.exists(indexHtmlFile, function(exists) {
      if (!exists) {
        dupCtrl = true;
        console.log(chalk.red("*** Route not created, please run this command at the root of this application"));
      }//if dir exist
    });
  },


  getCopyTemps: function() {
    if (!dupCtrl) {
      var baseCtrlPath = appParams.destDirPath+"/webClient/app/"+appParams.ngCtrlName;

      this.template(
        "newCtrl/_newCtrl.controller.js",
        baseCtrlPath+"/"+appParams.ngCtrlName+".controller.js" ,
        routePlaceholderValues
      );
      this.template(
        "newCtrl/_newCtrl.controller.spec.js",
        baseCtrlPath+"/"+appParams.ngCtrlName+".controller.spec.js",
        routePlaceholderValues
      );
    }//!dupCtrl
  },

  injectScripts: function(){
    if (!dupCtrl) {
      // inject js (controller.js/.js) into the index.html
      var indexHtmlFile = appParams.destDirPath+'/webClient/index.html';
      fs.exists(indexHtmlFile, function(exists) {
        if (exists) {
          fs.readFile(indexHtmlFile, 'utf8', function(err, data) {
            // find substring to update
            var re = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/m
            var contentsToUpdate = data.match(re)[1];

            // new content
            var scriptJs = '<script src="app/' + appParams.ngCtrlName + '/' + appParams.ngCtrlName + '.js"></script>';
            var scriptControllerJs = '<script src="app/' + appParams.ngCtrlName + '/' + appParams.ngCtrlName + '.controller.js"></script>';
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
    }//!dupCtrl
  },


});

module.exports = SimpleNgGenerator;

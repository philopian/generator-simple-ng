'use strict';
var util 	  = require('util');
var fs 		  = require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		  = require('lodash');
var chalk   = require('chalk');
var globby  = require('globby');


// globals
var appParams = {};
var dupFactory = false;
var routePlaceholderValues = {};


var SimpleNgGenerator = yeoman.generators.NamedBase.extend({

  initializing: function () {
    this.log('Wait a couple secs while we build out your "' + this.name + '" factory file.');
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
    appParams.userDefinedFactoryName = this.name;
    appParams.ngFactoryFileName = this._.camelize(appParams.userDefinedFactoryName)+"Factory";
    appParams.ngFactoryName = this._.capitalize( this._.camelize(appParams.userDefinedFactoryName)+"Factory" );


    // define some placeholder variables
    routePlaceholderValues = {
      NG_APP_NAME: appParams.ngModuleName,
      FACTORY_NAME: appParams.ngFactoryName
    }

    // check to see if route directory already exist
    var routePath = appParams.destDirPath+"/www/app/services/"+appParams.ngFactoryFileName+".js";
    fs.exists(routePath, function(exists) {
      if (exists) {
        dupFactory = true;
        console.log(chalk.red("*** there already seems to be a factory with that name, please choose another route name."));
      }//if dir exist
    });
  },


  getCopyTemps: function() {
    if (!dupFactory) {
      // CHECK TO SEE IF THE ROUTE DOESN'T ALREADY EXIST!!
      var baseRoutePath = appParams.destDirPath+"/www/app/services/";

      // copy template to dest dir
      this.template(
        "_factory.js",
        baseRoutePath+"/"+appParams.ngFactoryFileName+".js" ,
        routePlaceholderValues
      );
    }
  },



  injectScripts: function(){
    if (!dupFactory) {
      // inject js (controller.js/.js) into the index.html
      var indexHtmlFile = appParams.destDirPath+'/www/index.html';
      fs.exists(indexHtmlFile, function(exists) {
        if (exists) {
          fs.readFile(indexHtmlFile, 'utf8', function(err, data) {
            // find substring to update
            var re = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/m
            var contentsToUpdate = data.match(re)[1];

            // new content
            var scriptJs = '<script src="app/services/'+appParams.ngFactoryName+'.js"></script>';
            var scriptsToAdd = scriptJs + '\n';

            // append new content
            var newContentToUpdate = contentsToUpdate + scriptsToAdd;

            // update the html file
            var newHtmlContent = data.replace(contentsToUpdate, newContentToUpdate);

            fs.writeFile(indexHtmlFile, newHtmlContent, function (err) {
              if (err) throw err;
              console.log(chalk.green('injected into index.html '), scriptJs);
            });
          });// fs.readFile

        } else{
          console.log(chalk.red("./index.html seems to be missing??"));
        }
      });//fs.exists
    }//!dupRoute
  }


});

module.exports = SimpleNgGenerator;

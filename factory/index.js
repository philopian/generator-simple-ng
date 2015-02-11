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
    this.log('Wait a couple secs while we build out your "' + this.name + '" service file.');
  },

  getParams: function() {
    // define variables
    appParams.destDirPath = this.env.cwd;
    appParams.userDefinedNgModuleName = this.appname;
    appParams.ngModuleName = this._.camelize(appParams.userDefinedNgModuleName) + "App";
    appParams.userDefinedFactoryName = this.name;
    appParams.ngFactoryFileName = this._.camelize(appParams.userDefinedFactoryName)+"Service";
    appParams.ngFactoryName = this._.capitalize( this._.camelize(appParams.userDefinedFactoryName)+"Service" );
    

    // define some placeholder variables
    routePlaceholderValues = {
      NG_APP_NAME: appParams.ngModuleName,
      FACTORY_NAME: appParams.ngFactoryName
    }

    // check to see if route directory already exist
    var routePath = appParams.destDirPath+"/webClient/app/services/"+appParams.ngFactoryFileName+".js";
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
      var baseRoutePath = appParams.destDirPath+"/webClient/app/services/";

      // copy template to dest dir
      this.template(
        "_factory.js",
        baseRoutePath+"/"+appParams.ngFactoryFileName+".js" ,
        routePlaceholderValues
      );
    }

  },


  updateIndexHtmlScriptTags: function(){

    if (!dupFactory) {
      var spawn = require('child_process').spawn;
      var path = appParams.destDirPath;
      console.log(chalk.red(path));
      var tasks = ['cleanClientTags','injectClientTags']
      process.chdir(path);
      var child = spawn('gulp', tasks);
      child.stdout.on('data', function(data) {
          // if (data) console.log(data.toString())
      });
    }//if dupFactory

  }





});

module.exports = SimpleNgGenerator;

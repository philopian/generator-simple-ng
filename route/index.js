'use strict';
var util 	  = require('util');
var fs 		  = require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		  = require('lodash');
var chalk   = require('chalk');

var SimpleNgGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('You called the simple-ng subgenerator with the argument ' + this.name + '.');
  },



  getAppName: function(){

  	// define variables
    var destDirPath = this.env.cwd;
    var userDefinedNgModuleName = this.appname;
  	var ngModuleName = this._.camelize(userDefinedNgModuleName)+"App"; 	
  	var userDefinedRouteName = this.name;
  	var ngRouteName = this._.camelize(userDefinedRouteName); 
  	var ngRouteUrlName = "/"+ngRouteName;
    var ngControllerName = _.capitalize(ngRouteName+"Ctrl");
  	

  	// define some placeholder variables
    var routePlaceholderValues = {
        NG_APP_NAME: ngModuleName,
        ROUTE_NAME: ngRouteName,
        CONTROLLER_NAME: ngControllerName,		
        ROUTE_URL_NAME: ngRouteUrlName,
    }
    console.log(routePlaceholderValues);


    // copy template to dest dir
    var basePath = destDirPath+"/app/"+ngRouteName;
    this.copy(
        "newRoute/_newRoute.css",
        basePath+"/"+ngRouteName+".css"
    );
    this.template(  
        "newRoute/_newRoute.controller.js",    
        basePath+"/"+ngRouteName+".controller.js" ,
        routePlaceholderValues
    );
    this.template(  
        "newRoute/_newRoute.controller.spec.js",    
        basePath+"/"+ngRouteName+".controller.spec.js",
        routePlaceholderValues
    );
    this.template(  
        "newRoute/_newRoute.html",    
        basePath+"/"+ngRouteName+".html",
        routePlaceholderValues
    );
    this.template(  
        "newRoute/_newRoute.js",    
        basePath+"/"+ngRouteName+".js",
        routePlaceholderValues
    );


  // inject js (controller.js/.js) into the index.html
  var indexHtmlFile = destDirPath+'/index.html';
  fs.readFile(indexHtmlFile, 'utf8', function(err, data) {
    if (err) throw err;

    // find substring to update
    var re = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/m
    var contentsToUpdate = data.match(re)[1];

    // new content
    var scriptJs = '<script src="./app/'+ngRouteName+'/'+ngRouteName+'.js"></script>';
    var scriptControllerJs = '<script src="./app/'+ngRouteName+'/'+ngRouteName+'.controller.js"></script>';
    var scriptsToAdd = scriptJs+'\n'+scriptControllerJs+'\n';

    // append new content
    var newContentToUpdate = contentsToUpdate+scriptsToAdd;

    // update the html file
    var newHtmlContent = data.replace(contentsToUpdate, newContentToUpdate);

    fs.writeFile(indexHtmlFile, newHtmlContent, function(err){
      if (err) throw err;
      console.log(chalk.green('injected into index.html '), scriptJs );
      console.log(chalk.green('injected into index.html '), scriptControllerJs );
    });
  });// fs.readFile


  // inject css into the /app/app.css
  var cssFile = destDirPath+'/app/app.css';
  fs.readFile(cssFile, 'utf8', function(err, data) {
    if (err) throw err;

    var linkCss = '@import url("./'+ngRouteName+'/'+ngRouteName+'.css");';
    data += '\n'+linkCss+'\n';

    fs.writeFile(cssFile, data, function(err){
      if (err) throw err;
      console.log(chalk.green('injected into /app/app.css '), linkCss );
    });
  });// fs.readFile







  }



});

module.exports = SimpleNgGenerator;

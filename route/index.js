'use strict';
var util 	= require('util');
var fs 		= require('fs');
var yeoman 	= require('yeoman-generator');
var _ 		= require('lodash');

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





  }



});

module.exports = SimpleNgGenerator;

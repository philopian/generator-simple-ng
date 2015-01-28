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
	var ngModuleName = this._.camelize(this.appname)+"App"; 	
	var userDefinedNgModuleName = this.appname;
	var destDirPath = this.env.cwd;
	var userDefinedRouteName = this.name;
	var ngRouteName = this._.camelize(this.name); 
	var ngControllerName = _.capitalize(this._.camelize(this.appname)+"Ctrl");
	var ngRouteUrlName = "/#/"+this._.camelize(this.name);

  	// define some placeholder variables
    var routePlaceholderValues = {
        NG_APP_NAME: 		ngModuleName,
        ROUTE_NAME: 		ngRouteName,
        CONTROLLER_NAME: 	ngControllerName,		
        ROUTE_URL_NAME: 	ngRouteUrlName,
    }
    console.log(routePlaceholderValues);








  }



});

module.exports = SimpleNgGenerator;

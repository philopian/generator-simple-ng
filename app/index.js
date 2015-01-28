'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');

var HereGenerator = yeoman.generators.Base.extend({


    // prompt messages in terminal
    promptUser: function() {
        var done = this.async();

        // have Yeoman greet the user
        console.log(this.yeoman);

        var prompts = [
            {
                name: 'appName',
                message: 'What is your app\'s name ?',
                write: "your app name: " + this.appName
            }
        ];

        this.prompt(prompts, function (props) {

            this.appName              = props.appName;
            this.confirmRadness       = props.confirmRadness;
            this.listItemPicked       = props.listItemPicked;
            this.checkboxItemsPicked  = props.checkboxItemsPicked;

            done();
        }.bind(this));
    },


    // show the results that the user has chosen
    showResults: function(){
        var context = {
            app_name: this.appName
        };

        console.log(JSON.stringify(context));
    },// showResults



    // create the folders for your app
    scaffoldFolders: function(){
        this.mkdir("app");
        this.mkdir("app/welcome");
        this.mkdir("assets/images");
    },




    copyMainFiles: function(){

        var placeholderValues = {
            YOUR_APP_NAME_HERE : this.appName
        }


        // copy files and pass placeholder to the files that have placeholder item
        this.template(  
            "baseApp/_bower.json",    
            "bower.json", 
            placeholderValues
        );
        this.copy(
            "baseApp/favicon.ico",
            "favicon"
        );
        this.copy(
            "baseApp/assets/images/yeoman.png",  
            "assets/images/yeoman.png"
        );
        this.template(
            "baseApp/_index.html",                
            "index.html", 
            placeholderValues
        );
        this.copy(
            "baseApp/app/_app.css", 
            "app/app.css"
        );
        this.template(
            "baseApp/app/_app.js", 
            "app/app.js", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.controller.js", 
            "app/welcome/welcome.controller.js", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.controller.spec.js", 
            "app/welcome/welcome.controller.spec.js", 
            placeholderValues
        );
        this.copy(
            "baseApp/app/welcome/_welcome.css", 
            "app/welcome/welcome.css"
        );
        this.template(
            "baseApp/app/welcome/_welcome.html", 
            "app/welcome/welcome.html", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.js", 
            "app/welcome/welcome.js", 
            placeholderValues
        );


        // install bower components
        this.bowerInstall("", function(){
            console.log("\nEverything Setup !!!\n");
        });
    }









});

module.exports = HereGenerator;

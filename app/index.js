'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');

var SimpleNgGenerator = yeoman.generators.Base.extend({


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
    },// showResults



    // create the folders for your app
    scaffoldFolders: function(){
        this.mkdir("webClient")
        this.mkdir("webClient/app");
        this.mkdir("webClient/app/welcome");
        this.mkdir("webClient/app/ui-components/navbar");
        this.mkdir("webClient/assets/images");
    },




    copyMainFiles: function(){

        var placeholderValues = {
            NG_APP_NAME:            this._.camelize(this.appName)+"App",
            YOUR_APP_NAME_HERE :    this.appName
        }

        var camelizeVariable = this._.camelize(this.appname);


        // copy files and pass placeholder to the files that have placeholder item
        this.template(  
            "_bower.json",    
            "bower.json", 
            placeholderValues
        );
        this.copy(
            "_.bowerrc",
            ".bowerrc"
        );
        this.copy(
            "_.gitignore",
            ".gitignore"
        );
        this.copy(
            "_gulpfile.js",
            "gulpfile"
        );
        this.copy(
            "baseApp/favicon.ico",
            "webClient/favicon"
        );
        this.copy(
            "baseApp/assets/images/yeoman.png",  
            "webClient/assets/images/yeoman.png"
        );
        this.template(
            "baseApp/_index.html",                
            "webClient/index.html", 
            placeholderValues
        );
        this.template(
            "baseApp/app/ui-components/navbar/_navbar.html",  
            "webClient/app/ui-components/navbar/navbar.html", 
            placeholderValues
        );
        this.template(
            "baseApp/app/ui-components/navbar/_navbar.controller.js",                
            "webClient/app/ui-components/navbar/navbar.controller.js", 
            placeholderValues
        );
        this.copy(
            "baseApp/app/_app.css", 
            "webClient/app/app.css"
        );
        this.template(
            "baseApp/app/_app.js", 
            "webClient/app/app.js", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.controller.js", 
            "webClient/app/welcome/welcome.controller.js", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.controller.spec.js", 
            "webClient/app/welcome/welcome.controller.spec.js", 
            placeholderValues
        );
        this.copy(
            "baseApp/app/welcome/_welcome.css", 
            "webClient/app/welcome/welcome.css"
        );
        this.template(
            "baseApp/app/welcome/_welcome.html", 
            "webClient/app/welcome/welcome.html", 
            placeholderValues
        );
        this.template(
            "baseApp/app/welcome/_welcome.js", 
            "webClient/app/welcome/welcome.js", 
            placeholderValues
        );


        // install bower components
        this.bowerInstall("", function(){
            console.log(chalk.green("\nEverything Setup! enjoy!\n"));
        });
    }






});

module.exports = SimpleNgGenerator;

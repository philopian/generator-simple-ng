'use strict';
var util        = require('util');
var path        = require('path');
var yeoman      = require('yeoman-generator');
var chalk       = require('chalk');
var greeting    = require('../ascii-art-greeting');
var fse         = require('fs-extra');

// gobals
var dependsCompleted = {bower:false,npm:false,npmServer:false};
function checkDependCompletion(){
    if ((dependsCompleted.bower == true) && (dependsCompleted.npm == true) && (dependsCompleted.npmServer == true)) {
        console.log(chalk.green("\nYour app is all wired up, enjoy!\n"))
    }
}

var SimpleNgGenerator = yeoman.generators.Base.extend({

    // prompt messages in terminal
    promptUser: function() {
        var done = this.async();

        // have Yeoman greet the user
        console.log(greeting.stacker);

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
    },


    // create the folders for your app
    scaffoldFolders: function(){
        this.mkdir("webClient")
        this.mkdir("webClient/app");
        this.mkdir("webClient/app/welcome");
        this.mkdir("webClient/app/ui-components/navbar");
        this.mkdir("webClient/assets/images");
        this.mkdir("server/");
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
            "gulpfile.js"
        );
        this.copy(
            "baseApp/favicon.ico",
            "webClient/favicon"
        );
        this.copy(
            "baseApp/assets/images/yeoman.png",  
            "webClient/assets/images/yeoman.png"
        );
        this.copy(
            "baseServer/_server.js",
            "server/server.js"
        );
        this.template(
            "_package.json",
            "package.json",
            placeholderValues
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
    },

    installDepends: function(){
        // install bower components
        this.bowerInstall("", function(){
            dependsCompleted.bower = true;
            checkDependCompletion();
        });

        // install npm components
        this.npmInstall("", function(){
            dependsCompleted.npm = true;
            checkDependCompletion();

            installProjectServerDependencies();
        });

        // install npm components for the /server directory
        var templatePackageJsonFilePath = __dirname+"/templates/baseServer/_package.json";
        var packageJsonFilePath = this.env.cwd+'/server/package.json';
        var serverDirPath = this.env.cwd+'/server/';
        function installProjectServerDependencies(){
            fse.copy(templatePackageJsonFilePath, packageJsonFilePath, function (err) {
                if(err) {
                    console.log(err);
                } else {
                    var spawn = require('child_process').spawn;
                    var tasks = ['install']
                    process.chdir(serverDirPath);
                    var child = spawn('npm', tasks);
                    child.stdout.on('data', function() {
                        dependsCompleted.npmServer = true;
                        checkDependCompletion();
                    });    
                }
            }); 
        }//installProjectServerDependencies()
    }






});

module.exports = SimpleNgGenerator;

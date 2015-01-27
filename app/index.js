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




});

module.exports = HereGenerator;

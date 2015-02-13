'use strict';

angular.module('<%= NG_APP_NAME %>')
.service('<%= SERVICE_NAME %>', function(){

    var someData = ["AngularJS","NodeJS","MongoDB","Express"];

    this.fetchData= function(){
        return someData;
    };        
});
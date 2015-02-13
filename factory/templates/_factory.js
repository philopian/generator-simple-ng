'use strict';

angular.module('<%= NG_APP_NAME %>')
.factory('<%= FACTORY_NAME %>', function () {

    var someData = ["AngularJS","NodeJS","MongoDB","Express"];

    return {
        fetchData: function () {
            return someData;
        }
    };
});

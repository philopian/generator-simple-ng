'use strict';

angular.module('<%= YOUR_APP_NAME_HERE %>', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider
            .otherwise('/');

        //$locationProvider.html5Mode(true);
    });
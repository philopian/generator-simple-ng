'use strict';

angular.module('<%= YOUR_NG_APP %>', [
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
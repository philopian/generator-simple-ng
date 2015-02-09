'use strict';

angular.module('<%= NG_APP_NAME %>', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
        .otherwise('/');

    //$locationProvider.html5Mode(true);
})
.constant("BASE_URL",{
	"url": "http://localhost",
	"port": "8080"
});
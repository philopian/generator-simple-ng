'use strict';

angular.module('<%= NG_APP_NAME %>')
  .config(function ($stateProvider) {
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: 'app/welcome/welcome.html',
        controller: 'WelcomeCtrl'
      });
  });
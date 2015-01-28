'use strict';

angular.module('<%= YOUR_NG_APP %>')
  .config(function ($stateProvider) {
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: 'app/welcome/welcome.html',
        controller: 'WelcomeCtrl'
      });
  });
'use strict';

angular.module('<%= NG_APP_NAME %>')
  .config(function ($stateProvider) {
    $stateProvider
      .state('<%= ROUTE_NAME %>', {
        url: '<%= ROUTE_URL_NAME %>',
        templateUrl: 'app/views/<%= ROUTE_NAME %>/<%= ROUTE_NAME %>.html',
        controller: '<%= CONTROLLER_NAME %>'
      });
  });

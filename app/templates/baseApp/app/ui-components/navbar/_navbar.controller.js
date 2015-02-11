'use strict';

angular.module('<%= NG_APP_NAME %>')
    .controller('NavbarCtrl', function ($scope, $location) {

        // Menu list a bunch of items in the navbar here
        $scope.menu = [
            {
                'title': 'Welcome',
                'link': '/'
            }

        ];

        $scope.isCollapsed = true;

        // show which link in the navbar is the current path
        $scope.isActive = function(route) {
            return route === $location.path();
        };

    });
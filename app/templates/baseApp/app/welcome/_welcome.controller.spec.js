'use strict';

describe('Controller: WelcomeCtrl', function () {

  // load the controller's module
  beforeEach(module('<%= YOUR_APP_NAME_HERE %>'));

  var WelcomeCtrl, 
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WelcomeCtrl = $controller('WelcomeCtrl', {
      $scope: scope
    });
  }));


  it('should ...', function () {
    expect(1).toEqual(1);
  });


  it('should attach a list of things to the scope', function () {
    expect(scope.awesomeThings.length).toBe(9);
  });


});


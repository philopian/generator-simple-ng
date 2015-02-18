'use strict';

describe('Controller: <%= CONTROLLER_NAME %>', function () {

  // load the controller's module
  beforeEach(module('<%= NG_APP_NAME %>'));

  var <%= CONTROLLER_NAME %>, 
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    <%= CONTROLLER_NAME %> = $controller('<%= CONTROLLER_NAME %>', {
      $scope: scope
    });
  }));


  it('should ...', function () {
    expect(1).toEqual(1);
  });


  it('should attach a list of things to the scope', function () {
    expect(scope.awesomeThings.length).toBe(10);
  });


});


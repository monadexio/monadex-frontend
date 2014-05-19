'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('monadexApp.controllers'));


  it('should ....', inject(function($controller) {
    //spec body
    var monadexDesigner = $controller('MonadexTshirtDesigner', { $scope: {} });
    expect(monadexDesigner).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    //spec body
    var monadexCtrl2 = $controller('MonadexCtrl2', { $scope: {} });
    expect(monadexCtrl2).toBeDefined();
  }));
});

'use strict';

/* Directives */
angular.module('monadexApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('tshirtDesigner', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/tshirt-designer.html',
      link: function() {}
    };
  });


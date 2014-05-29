'use strict';


// Declare app level module which depends on filters, and services
angular.module('monadexApp', [
  'ngRoute',
  'monadexApp.filters',
  'monadexApp.services',
  'monadexApp.directives',
  'monadexApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/designer', {templateUrl: 'partials/designer-page.html', controller: 'MonadexTshirtDesigner'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MonadexCtrl2'});
  $routeProvider.otherwise({redirectTo: '/designer'});
}]);

'use strict';


// Declare app level module which depends on filters, and services
var monadexApp = angular.module('monadexApp', [
    'ngRoute',
    'monadexApp.filters',
    'monadexApp.services',
    'monadexApp.directives',
    'monadexApp.controllers'
]);

monadexApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(
        '/designer',
        {
            templateUrl: 'partials/tshirt-designer-page.html',
            controller: 'MonadexTshirtDesigner'
        }
    );
    $routeProvider.otherwise({redirectTo: '/designer'});
}]);

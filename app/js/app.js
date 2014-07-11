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
        '/landing',
        {
            templateUrl: 'partials/landing/landing-main.html',
            controller: 'MonadexTshirtDesigner'
        },
        '/designer',
        {
            templateUrl: 'partials/tshirt-designer-pages/designer-main.html',
            controller: 'MonadexTshirtDesigner'
        }
    );
    $routeProvider.otherwise({redirectTo: '/landing'});
}]);

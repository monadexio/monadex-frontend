'use strict';


// Declare app level module which depends on filters, and services
var monadexApp = angular.module('monadexApp', [
    'ngRoute',
    'monadexApp.filters',
    'monadexApp.services',
    'monadexApp.directives',
    'monadexApp.controllers',
    'textAngular'
]);

monadexApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(
        '/landing',
        {
            templateUrl: 'partials/landing/landing-main.html',
            controller: 'MonadexTshirtLanding'
        }
    );

    $routeProvider.when(
        '/designer',
        {
            templateUrl: 'partials/designer/designer-main.html',
            controller: 'MonadexTshirtDesigner'
        }
    );

    $routeProvider.when(
        '/sales_goal',
        {
            templateUrl: 'partials/sales_goal/sales-goal-main.html',
            controller: 'MonadexTshirtSalesGoal'
        }
    );

    $routeProvider.when(
        '/details',
        {
            templateUrl: 'partials/details/details-main.html',
            controller: 'MonadexTshirtCampaignDetails'
        }
    );

    $routeProvider.otherwise({redirectTo: '/landing'});
}]);

monadexApp.run(function($rootScope, $location, $anchorScroll, $timeout, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();
    });
});

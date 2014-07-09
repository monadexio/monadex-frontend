'use strict';

/* Filters */

var monadexFilter = angular.module('monadexApp.filters', []);

monadexFilter.filter('interpolate', ['version',
    function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }
]);

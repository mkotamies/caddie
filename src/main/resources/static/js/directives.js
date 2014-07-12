'use strict';

/* Directives */


var directives = angular.module('directives', []);

directives.directive('result', function () {
    return {
        restrict: "E",
        replace: true,
        require: '^ngModel',
        scope: {
            ngModel: '=',
            value: '&',
            reverse: '='
        },
        templateUrl: 'templates/result.html'
    }
});
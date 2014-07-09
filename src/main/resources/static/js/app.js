'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('web', [
    'ngRoute',
    'services',
    'controllers',
    'ngAnimate',
    'ngTouch'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/courseselect.html', controller: 'CourseSelectController'});
        $routeProvider.when('/scorecard', {templateUrl: 'partials/scorecard.html', controller: 'ScorecardController'});
        $routeProvider.when('/analysis', {templateUrl: 'partials/analysis.html', controller: 'AnalysisController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]).run(['RoundService', function(roundService) {
        toastr.options = {
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": 3000
        }

        if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
        }

        roundService.loadCurrentRound();
    }]);

angular.module('controllers', ['services']);

app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);
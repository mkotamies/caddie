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

directives.directive('clubselector', function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            clubs: '=',
            selection: '=',
            callback: '&'
        },
        templateUrl: 'templates/clubselect.html',
        link: function(scope, elm, attrs) {

            scope.addClub = function(club) {
                if(!scope.selection) {
                    scope.selection = [];
                }
                scope.selection.push(club);
                scope.callback();
            }

            scope.removeClub = function() {
                scope.selection.splice(scope.selection.length-1, 1);
            }
        }
    }
});

directives.directive('rowheader', function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            title: '@',
            array: '=',
            value:'=',
            collapseTarget: '@'
        },
        templateUrl: 'templates/rowheader.html',
        link: function(scope, elm, attrs) {

        }
    }
});

directives.directive('groupselector', function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            values: '=',
            selections:'=',
            multiselect: '=',
            callback: '&'
        },
        templateUrl: 'templates/groupselector.html',
        link: function(scope, elm, attrs) {

            if(!scope.selections) {
                scope.selections = scope.multiselect ? [] : null;
            }

            scope.valueClicked = function(value) {

                if(scope.multiselect) {
                    var index = scope.selections.indexOf(value);

                    if(index != -1) {
                        scope.selections.splice(index, 1);
                    }
                    else {
                        scope.selections.push(value);
                    }
                }
                else {
                    if(scope.selections != value) {
                        scope.selections = value;
                    }
                    else {
                        scope.selections = null;
                    }
                }

                scope.callback();
            }
        }
    }
});
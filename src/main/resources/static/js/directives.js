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
            additional: '=',
            selection: '=',
            callback: '&'
        },
        templateUrl: 'templates/clubselect.html',
        link: function(scope, elm, attrs) {

            scope.addStroke = function(club) {
                if(!scope.selection) {
                    scope.selection = [];
                }
                scope.selection.push({club: club});
                scope.callback();
            }

            scope.removeStroke = function() {
                scope.selection.splice(scope.selection.length-1, 1);
            }

            scope.additionalSelected = function(key, value) {
                var currentStroke = scope.selection[scope.selection.length-1];

                if(currentStroke[key] == value) {
                    currentStroke[key] = null;
                }
                else {
                    currentStroke[key] = value;
                }
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
            collapseTarget: '@',
            icon: '@',
            showIcon: '='
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

directives.directive('buttongroup', function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            values: '=',
            selection: '='
        },
        templateUrl: 'templates/buttongroup.html',
        link: function(scope, elm, attrs) {
            scope.selected = function(value) {

                if(scope.selection == value) {
                    scope.selection = null;
                }
                else {
                    scope.selection = value;
                }

            }
        }
    }
});
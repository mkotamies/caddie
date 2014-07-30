'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('web', [
    'ngRoute',
    'services',
    'controllers',
    'analysisservices',
    'analysiscontrollers',
    'directives',
    'ngAnimate',
    'ngTouch',
    'chartjs'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/new', {templateUrl: 'partials/newround.html', controller: 'NewRoundController'});

        $routeProvider.when('/current', {templateUrl: 'partials/collector.html', controller: 'CollectorController', reloadOnSearch: false});
        $routeProvider.when('/scorecard', {templateUrl: 'partials/scorecard.html', controller: 'ScorecardController'});
        $routeProvider.when('/completed/:id', {templateUrl: 'partials/completedround.html', controller:'CompletedRoundController'});

        $routeProvider.when('/list', {templateUrl: 'partials/roundlist.html', controller: 'RoundListController'});

        $routeProvider.when('/view/:id/overview', {templateUrl: 'partials/overview.html', controller: 'OverviewController'});
        $routeProvider.when('/view/:id/holes', {templateUrl: 'partials/holeanalysis.html', controller: 'HoleAnalysisController'});
        $routeProvider.when('/view/:id/flow', {templateUrl: 'partials/flowanalysis.html', controller: 'FlowController'});

        $routeProvider.when('/errors', {templateUrl: 'partials/errorlist.html', controller: 'ErrorListController'});
        $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsController'});
        $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutController'});
        $routeProvider.otherwise({redirectTo: '/current'});
    }]).run(['RoundService', 'ErrorService', function(roundService, errorService) {

        window.onerror = errorService.logError;

        toastr.options = {
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": 3000
        }

        Chart.defaults.global = {
            // Boolean - Whether to animate the chart
            animation: true,

            // Number - Number of animation steps
            animationSteps: 60,

            // String - Animation easing effect
            animationEasing: "easeOutQuart",

            // Boolean - If we should show the scale at all
            showScale: true,

            // Boolean - If we want to override with a hard coded scale
            scaleOverride: false,

            // ** Required if scaleOverride is true **
            // Number - The number of steps in a hard coded scale
            scaleSteps: null,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            // Number - The scale starting value
            scaleStartValue: null,

            // String - Colour of the scale line
            scaleLineColor: "rgba(0,0,0,.1)",

            // Number - Pixel width of the scale line
            scaleLineWidth: 1,

            // Boolean - Whether to show labels on the scale
            scaleShowLabels: true,

            // Interpolated JS string - can access value
            scaleLabel: "<%=value%>",

            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleIntegersOnly: true,

            // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: false,

            // String - Scale label font declaration for the scale label
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Scale label font size in pixels
            scaleFontSize: 12,

            // String - Scale label font weight style
            scaleFontStyle: "bold",

            // String - Scale label font colour
            scaleFontColor: "#666",

            // Boolean - whether or not the chart should be responsive and resize when the browser does.
            responsive: false,

            // Boolean - Determines whether to draw tooltips on the canvas or not
            showTooltips: true,

            // Array - Array of string names to attach tooltip events
            tooltipEvents: ["mousemove", "touchstart", "touchmove"],

            // String - Tooltip background colour
            tooltipFillColor: "rgba(0,0,0,0.8)",

            // String - Tooltip label font declaration for the scale label
            tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip label font size in pixels
            tooltipFontSize: 14,

            // String - Tooltip font weight style
            tooltipFontStyle: "normal",

            // String - Tooltip label font colour
            tooltipFontColor: "#fff",

            // String - Tooltip title font declaration for the scale label
            tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip title font size in pixels
            tooltipTitleFontSize: 14,

            // String - Tooltip title font weight style
            tooltipTitleFontStyle: "bold",

            // String - Tooltip title font colour
            tooltipTitleFontColor: "#fff",

            // Number - pixel width of padding around tooltip text
            tooltipYPadding: 6,

            // Number - pixel width of padding around tooltip text
            tooltipXPadding: 6,

            // Number - Size of the caret on the tooltip
            tooltipCaretSize: 8,

            // Number - Pixel radius of the tooltip border
            tooltipCornerRadius: 6,

            // Number - Pixel offset from point x to tooltip edge
            tooltipXOffset: 10,

            // String - Template string for single tooltips
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

            // String - Template string for single tooltips
            multiTooltipTemplate: "<%= value %>",

            // Function - Will fire on animation progression.
            onAnimationProgress: function(){},

            // Function - Will fire on animation completion.
            onAnimationComplete: function(){}
        }

        if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
        }

        roundService.loadCurrentRound();
    }]);

angular.module('controllers', ['services'])
angular.module('analysiscontrollers', ['analysisservices']);

app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);

app.filter('result', ['$filter', function ($filter) {
    return function (input, negativeIsBetter) {
        alert(input);

        if(input > 0) {
            return '+' + input;
        }
        else {
            return input;
        }
    };
}]);
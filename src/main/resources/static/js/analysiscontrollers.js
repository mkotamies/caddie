var controllers = angular.module('analysiscontrollers');

controllers.controller('OverviewController', ['$scope', 'AnalysisRepository', '$routeParams',
    function ($scope, analysisRepo, $routeParams) {

        $scope.id = $routeParams.id;
        loadAnalysis(analysisRepo, $routeParams.id, function(data) {
            $scope.round = data.roundData;
            $scope.id = $routeParams.id;
        });

    }]);

controllers.controller('FlowController', ['$scope', 'AnalysisRepository', '$routeParams',
    function ($scope, analysisRepo, $routeParams) {

        $scope.id = $routeParams.id;
        loadAnalysis(analysisRepo, $routeParams.id, function(data) {

            $scope.holes = data.roundData.data.holes;

            $scope.holeData = {
                labels: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                    "10", "11", "12", "13", "14", "15", "16", "17", "18"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.0)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        data: [0]
                    }
                ]
            };

            var dataSet = $scope.holeData.datasets[0].data;

            angular.forEach($scope.holes, function (hole) {

                if (hole.strokes) {
                    dataSet.push(dataSet[dataSet.length - 1] + (hole.gamePar - hole.strokes));
                }
            });

            var max = Math.max.apply(null, dataSet);
            var min = Math.min.apply(null, dataSet);

            var diff = Math.max(Math.abs(min), max);

            var scale = Math.floor(diff / 10) + 1;

            $scope.dataOptions = {
                // Boolean - If we want to override with a hard coded scale
                scaleOverride: true,

                // ** Required if scaleOverride is true **
                // Number - The number of steps in a hard coded scale
                scaleSteps: scale * 20,
                // Number - The value jump in the hard coded scale
                scaleStepWidth: 1,
                // Number - The scale starting value
                scaleStartValue: scale * -10
            }
        });
    }]);

controllers.controller('HoleAnalysisController', ['$scope', 'AnalysisRepository', '$routeParams',
    function ($scope, analysisRepo, $routeParams) {

        $scope.id = $routeParams.id;
        loadAnalysis(analysisRepo, $routeParams.id, function(data) {
            $scope.analysis = data.analysis;
        });
    }]);

function loadAnalysis(repo, id, callback) {
    repo.analysisForRound(id, function (data, error) {

        if (data) {
            callback(data);
        }
        else {
            toastr.warning(error);
        }
    });
}
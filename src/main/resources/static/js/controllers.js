var controllers = angular.module('controllers');


controllers.controller('NavigationController', ['$scope', 'RoundService', '$location',
    function ($scope, roundService, $location) {

        $scope.newRound = function () {

            var conf;
            var currentRound = roundService.getCurrentRound();

            if(currentRound != null) {
                conf = confirm("Are you sure want to start a new round? Data of the current round will be lost.");
            }

            if (conf || !currentRound) {
                roundService.clearCurrentRound();
                $location.path("/new");
            }
        }
    }]);

controllers.controller('NewRoundController', ['$scope', 'CourseService', 'CalcService', 'RoundService', '$location',
    function ($scope, courseService, calcService, roundService, $location) {

        var hcp = courseService.loadHcp();
        $scope.hcp = hcp != null ? parseFloat(hcp) : 54.0;
        $scope.gameHcp = "-";

        $scope.selectCourse = function (course) {
            $scope.selectedCourse = course;
        }

        $scope.hcpUp = function (hcpUp) {
            $scope.hcp = Math.round(($scope.hcp + hcpUp) * 10) / 10;
            $scope.calcGameHcp();
        }

        $scope.hcpDown = function (hcpDown) {
            $scope.hcp = Math.round(($scope.hcp - hcpDown) * 10) / 10;
            $scope.calcGameHcp();
        }

        $scope.calcGameHcp = function () {

            if ($scope.hcp && $scope.selectedCourse) {
                var gameHcp = calcService.calculateGameHcp($scope.hcp, $scope.selectedCourse.slope, $scope.selectedCourse.cr, $scope.selectedCourse.par);
            }

            $scope.gameHcp = gameHcp ? gameHcp : "-";
        }

        $scope.startRound = function() {
            $scope.selectedCourse.courseName = $scope.club.name;
            roundService.startRound($scope.selectedCourse, $scope.hcp, $scope.gameHcp);
            $location.path('/current').search('hole', 1);
        }

        $scope.init = function() {
            //Load available courses
            courseService.listClubs(function (data, error) {
                if (error) {
                    toastr.warning(error);
                }
                else {
                    $scope.clubList = data;
                }
            });
        }

        $scope.$watch('selectedClub', function (newValue) {

            if (newValue) {
                courseService.getClubData(newValue, function (data, error) {
                    if (data) {
                        $scope.club = data;
                    }
                    else {
                        toastr.warning(error);
                    }
                });
            }
            else {
                $scope.club = null;
            }
        });

        $scope.$watch('selectedCourse', function () {
            $scope.calcGameHcp();
        });
        $scope.$watch('hcpFullValue', function () {
            $scope.calcGameHcp();
        });
        $scope.$watch('hcpDigitsValue', function () {
            $scope.calcGameHcp();
        });

        $scope.init();
    }]);


controllers.controller('CollectorController', ['$scope', 'CourseService', 'RoundService', '$location', 'CalcService', 'ProfileService', '$routeParams',
    function ($scope, courseService, roundService, $location, calcService, profileService, $routeParam) {

        $scope.gameRunning = false;
        $scope.totalValues = [1,2,3,4,5,6,7,8,9];

        $scope.startRound = function () {
            $scope.selectedCourse.courseName = $scope.club.name;

            $scope.currentRound = roundService.startRound($scope.selectedCourse);
            $scope.currentRound.data.hcp = $scope.hcp;
            $scope.currentRound.data.gameHcp = $scope.gameHcp;

            var pointsPerHole = Math.floor($scope.currentRound.data.gameHcp / 18);
            var extraPointHoles = Math.floor($scope.currentRound.data.gameHcp % 18);

            for (var key in $scope.currentRound.data.holes) {
                var hole = $scope.currentRound.data.holes[key]
                hole.gamePar = hole.par + pointsPerHole;

                if (hole.hcp <= extraPointHoles) {
                    hole.gamePar += 1;
                }
            }

            courseService.saveHcp($scope.hcp);

            $scope.holeNro = 1;
        }

        $scope.prevHole = function () {
            if ($scope.holeNro > 1) {
                $scope.holeNro -= 1;
            }
            else {
                $scope.holeNro = 18;
            }

            $location.search('hole', $scope.holeNro);
        }

        $scope.nextHole = function () {
            if ($scope.holeNro < 18) {
                $scope.holeNro += 1;
            }
            else {
                $scope.holeNro = 1;
            }

            $location.search('hole', $scope.holeNro);
            $('#opening').collapse('show');
        }

        $scope.roundScore = function () {

            var score = 0;

            if (!$scope.currentRound) {
                return score;
            }

            for (var key in $scope.currentRound.data.holes) {
                var strokes = $scope.currentRound.data.holes[key].strokes;

                if (strokes && strokes != null && strokes != "-") {
                    score += strokes;
                }
                else if (strokes == "-") {
                    score += $scope.currentRound.data.holes[key].gamePar + 2;
                }

            }

            return score;
        }

        $scope.parScore = function () {
            var score = 0;

            if (!$scope.currentRound) {
                return score;
            }

            for (var key in $scope.currentRound.data.holes) {

                if ($scope.currentRound.data.holes[key].strokes) {
                    score += $scope.currentRound.data.holes[key].gamePar;
                }
            }

            return score;
        }

        $scope.scoreSpec = function () {
            return $scope.roundScore() - $scope.parScore();
        }

        $scope.roundPoints = function () {
            var points = 0;

            if (!$scope.currentRound) {
                return points;
            }

            for (var key in $scope.currentRound.data.holes) {
                var hole = $scope.currentRound.data.holes[key];
                var strokes = hole.strokes;

                if (strokes && strokes != null && strokes != "-") {
                    points += Math.max(0, hole.gamePar - strokes + 2);
                }
            }

            return points;
        }

        $scope.parPoints = function () {
            var points = 0;

            if (!$scope.currentRound) {
                return points;
            }

            for (var key in $scope.currentRound.data.holes) {

                if ($scope.currentRound.data.holes[key].strokes) {
                    points += 2;
                }
            }

            return points;
        }

        $scope.pointSpec = function () {
            return $scope.roundPoints() - $scope.parPoints();
        }

        $scope.completeRound = function () {

            var r = confirm("Are you sure want to complete this round? You can not change values after completion.");
            if (r == true) {
                roundService.saveRoundData(function (id, error) {
                    if (error) {
                        toastr.warning(error);
                    }
                    else {
                        $scope.currentRound = null;
                        $location.path("/completed/" + id);
                    }
                });
            }
        }

        $scope.calculateHoleTotal = function() {
            var hole = $scope.currentRound.data.holes[$scope.holeNro];

            var total = 0;

            if(hole.opening) {
                total += hole.opening.length;
            }

            if(hole.approach) {
                total += hole.approach.length;
            }

            if(hole.chip) {
                total += hole.chip.length;
            }

            if(hole.puts) {
                total += hole.puts.length;
            }

            hole.strokes = total;
        }

        $scope.totalsOverridden = function(overridden) {
            $scope.currentRound.data.holes[$scope.holeNro].totalsOverridden = overridden;
        }

        $scope.mapStrokes = function(value) {

            if($scope.currentRound && $scope.currentRound.data.holes[$scope.holeNro]) {
                var clubs = _.map($scope.currentRound.data.holes[$scope.holeNro][value], function(stroke) {return stroke.club});

                if(clubs.length > 0) {
                    return clubs.join(", ");
                }
                else {
                    return "";
                }
            }
            else {
                return "";
            }
        }

        $scope.init = function () {

            var currentRound = roundService.getCurrentRound();

            if (currentRound) {
                $scope.currentRound = currentRound;

                var hole = parseInt($location.search().hole);

                if(hole) {
                    $scope.holeNro = hole;
                }
                else {
                    $scope.holeNro = 1;
                }
            }
            else {
                $location.path('/new');
            }


            $scope.chipClubs = profileService.getChipClubs();
            $scope.approachClubs = profileService.getApproachClubs();
            $scope.openingClubs = profileService.getOpeningClubs();
            $scope.putDistances = profileService.getPutDistances();

        }

        $scope.init();

        $scope.$watch('currentRound.data', function () {


            if($scope.currentRound && !$scope.currentRound.data.holes[$scope.holeNro].totalsOverridden) {
                $scope.calculateHoleTotal();
            }

            if($scope.currentRound) {
                roundService.calculateStrokes();
                roundService.cacheCurrentRound();
            }
        }, true);


    }]);

controllers.controller('ScorecardController', ['$scope', 'CourseService', 'RoundService', '$location',
    function ($scope, courseService, roundService, $location) {
        $scope.currentRound = roundService.getCurrentRound();

        $scope.holes = function () {

            var holes = [];

            for (var i = 1; i <= 18; i++) {
                holes.push(i);
            }

            return holes;
        }

        $scope.filterHoles = function (hole) {

            if (!$scope.currentRound) {
                return false;
            }

            return $scope.currentRound.data.holes[hole].strokes != null;
        }
    }]);

controllers.controller('RoundListController', ['$scope', 'CourseService', 'RoundService', '$location',
    function ($scope, courseService, roundService, $location) {

       $scope.result = 4;

       roundService.listRounds(function(data, error) {
           if(data) {
               $scope.roundHeaders = data;
           }
           else {
               toastr.warning(error);
           }
       });

       $scope.open = function(header) {
           $location.path('/overview/' + header.id);
       }
    }]);

controllers.controller('SettingsController', ['$scope', 'ProfileService',
    function ($scope, profileService) {


        $scope.init = function() {
            var clubs = profileService.listAllClubs();
            $scope.allClubs = _.union(clubs.woods, clubs.irons, clubs.wedges);

            $scope.clubs = profileService.getClubs();
        }

        $scope.$watch('clubs', function(newValue) {
            profileService.saveClubSelection($scope.clubs);
        }, true)

        $scope.init();
    }]);

controllers.controller('ErrorListController', ['$scope', 'ErrorService',
    function ($scope, errorService) {

        $scope.errors = errorService.errors;
    }]);


controllers.controller('AboutController', ['$scope', 'RoundService',
    function ($scope, roundService) {

        $scope.version = '1.3.0';
        $scope.deviceId = roundService.getDeviceId();
    }]);

controllers.controller('CompletionController', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
        $scope.id = $routeParams.id;
    }]);

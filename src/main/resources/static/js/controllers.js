var controllers = angular.module('controllers');


controllers.controller('NavigationController', ['$scope', 'RoundService', '$location',
    function ($scope, roundService, $location) {

        $scope.newRound = function () {

            var r = confirm("Are you sure want to start a new round? Data of the current round will be lost.");
            if (r == true) {
                roundService.newRound();
                $location.path("/new");
            }
        }
    }]);


controllers.controller('CourseSelectController', ['$scope', 'CourseService', 'RoundService', '$location', 'CalcService', 'ProfileService',
    function ($scope, courseService, roundService, $location, calcService, profileService) {

        $scope.gameRunning = false;
        $scope.putValues = [0,1,2,3,4,5,6];
        $scope.totalValues = [1,2,3,4,5,6,7,8,9];
        $scope.openPart = null;

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
        }

        $scope.nextHole = function () {
            if ($scope.holeNro < 18) {
                $scope.holeNro += 1;
            }
            else {
                $scope.holeNro = 1;
            }

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

        $scope.$watch('selectedClub', function (newValue, oldValue) {

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

        $scope.updatePosition = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.updateLocation, $scope.locationUpdateError, {enableHighAccuracy: true});
            } else {
                $scope.coordinates = 'GPS not available';
            }
        }

        $scope.updateLocation = function (position) {
            $scope.$apply(function () {
                $scope.coordinates = position.coords;

                if ($scope.position) {
                    $scope.calcDistance();
                }

                toastr.info("Position updated!");
            });
        }

        $scope.startTracking = function () {
            $scope.position = {};
            $scope.position.start = $scope.coordinates;
            $scope.position.startAccuracy = $scope.accuracy;
        }

        $scope.stopTracking = function () {
            $scope.position = null;
        }


        $scope.calcDistance = function () {
            /*
            var lat1 = $scope.position.start.latitude;
            var lon1 = $scope.position.start.longitude;

            var lat2 = $scope.coordinates.latitude;
            var lon2 = $scope.coordinates.longitude;

            var R = 6378137; // m
            var φ1 = lat1.toRad();
            var φ2 = lat2.toRad();
            var Δφ = (lat2 - lat1).toRad();
            var Δλ = (lon2 - lon1).toRad();

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            $scope.position.distance = d;*/
        }

        $scope.locationUpdateError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    toastr.warning("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    toastr.warning("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    toastr.warning("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    toastr.warning("An unknown error occurred.");
                    break;
            }
        }

        $scope.saveRound = function () {
            roundService.saveRoundData(function (error) {
                if (error) {
                    toastr.warning(error);
                }
                else {
                    toastr.info("Round saved successfully!");
                }
            });
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
                total += hole.puts;
            }

            hole.strokes = total;
        }

        $scope.filled = function(filledPart) {

            if(filledPart == 'opening') {
                $('#' + filledPart).collapse('hide');

                if($scope.currentRound.data.holes[$scope.holeNro].par == 3) {
                    $('#puts').collapse('show');
                }
                else {
                    $('#approach').collapse('show');
                }
            }
            else if(filledPart == 'approach') {
                if($scope.currentRound.data.holes[$scope.holeNro].par == 4) {
                    $('#' + filledPart).collapse('hide');
                    $('#puts').collapse('show');
                }
                else if($scope.currentRound.data.holes[$scope.holeNro].approach &&
                    $scope.currentRound.data.holes[$scope.holeNro].approach.length == 2){
                    $('#' + filledPart).collapse('hide');
                    $('#puts').collapse('show');
                }
            }
            else if(filledPart == 'chip') {
                $('#chip').collapse('hide');
            }
            else if(filledPart == 'puts') {
                $('#puts').collapse('hide');
            }
        }

        $scope.totalsOverridden = function(overridden) {
            $scope.currentRound.data.holes[$scope.holeNro].totalsOverridden = overridden;
        }

        $scope.init = function () {

            var currentRound = roundService.getCurrentRound();

            if (currentRound) {
                $scope.currentRound = currentRound;

                $scope.holeNro = 1;

                if($scope.currentRound.data) {
                    for (var i = 1; i < 19; i++) {
                        if (!$scope.currentRound.data.holes[i].strokes) {
                            $scope.holeNro = i;
                            break;
                        }
                    }
                }

            }
            else {
                //Load available courses
                courseService.listClubs(function (data, error) {
                    if (data) {
                        $scope.clubList = data;
                    }
                });
            }

            $scope.chipClubs = profileService.getChipClubs();
            $scope.approachClubs = profileService.getApproachClubs();
            $scope.openingClubs = profileService.getOpeningClubs();

        }


        $scope.$watch('selectedCourse', function (newValue, oldValue) {
            $scope.calcGameHcp();
        });
        $scope.$watch('hcpFullValue', function (newValue, oldValue) {
            $scope.calcGameHcp();
        });
        $scope.$watch('hcpDigitsValue', function (newValue, oldValue) {
            $scope.calcGameHcp();
        });

        $scope.init();

        $scope.$watch('currentRound.data', function (newValue, oldValue) {

            if(!$scope.currentRound.data.holes[$scope.holeNro].totalsOverridden) {
                $scope.calculateHoleTotal();
            }

            roundService.calculateStrokes();
            roundService.cacheCurrentRound();
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

controllers.controller('AnalysisController', ['$scope', 'RoundService', 'CalcService',
    function ($scope, roundService, calcService) {

        $scope.analysis = calcService.analyseRound(roundService.getCurrentRound().data);
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

        $scope.version = '1.2.0';
        $scope.deviceId = roundService.getDeviceId();
    }]);
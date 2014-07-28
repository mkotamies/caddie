var services = angular.module('services', []);

services.factory('CourseService', ['$http', 'ErrorService', function ($http, $resource, errorService) {

    return {
        listClubs: function (callback) {
            callback(["Hill Side Valley", "Paloheina Golf", "Pickala Golf Forest", "Pickala Golf Park", "Vihti Golf"]);
        },
        getClubData: function (club, callback) {

            $http.get('./clubs.json')
                .success(function (data) {
                    callback(_.find(data, function (elem) {
                        return elem.name == club;
                    }));
                })
                .error(function (error) {
                    console.log("Error " + error);
                    errorService.logError(error, null, null);
                    callback("Failed to load club info!")
                })
        },
        saveHcp: function (hcp) {
            window.localStorage.setItem("caddieHcp", hcp);
        },
        loadHcp: function () {
            return window.localStorage.getItem("caddieHcp");
        }
    }
}]);

services.factory('RoundService', ['$http', 'CourseService', 'CalcService', function ($http, courseService, calcService) {

    var currentRound = null;

    return {
        loadCurrentRound: function () {
            var loaded = window.localStorage.getItem("caddie.round.current");

            if (loaded && loaded != 'undefined') {
                currentRound = JSON.parse(loaded);
            }

            return currentRound;
        },
        cacheCurrentRound: function () {
            if (currentRound != null) {
                window.localStorage.setItem("caddie.round.current", JSON.stringify(currentRound));
            }
        },
        clearCurrentRound : function() {
            window.localStorage.removeItem("caddie.round.current");
            currentRound = null;
        },
        getCurrentRound: function () {
            return currentRound;
        },
        startRound: function (selectedCourse, hcp, gameHcp) {
            currentRound = {};
            currentRound.courseName = selectedCourse.courseName;
            currentRound.hcp = hcp;
            currentRound.gameHcp = gameHcp;
            currentRound.timestamp = new Date();

            currentRound.data = {};
            currentRound.data = angular.copy(selectedCourse);
            delete currentRound.data.courseName;

            var pointsPerHole = Math.floor(currentRound.gameHcp / 18);
            var extraPointHoles = Math.floor(currentRound.gameHcp % 18);

            for (var key in currentRound.data.holes) {
                var hole = currentRound.data.holes[key];
                hole.gamePar = hole.par + pointsPerHole;

                if (hole.hcp <= extraPointHoles) {
                    hole.gamePar += 1;
                }
            }

            courseService.saveHcp(hcp);

            this.cacheCurrentRound();
        },
        saveRoundData: function (callback) {

            var request = angular.copy(currentRound);
            request.deviceId = this.getDeviceId();
            request.newHcp = calcService.calculateNewHcp(request.hcp, calcService.calculateBogeyPoints(request.data.holes))

            var clear = this.clearCurrentRound;

            $http.post('/api/rounds/', request)
                .success(function (storedId) {
                    clear();
                    callback(storedId);
                })
                .error(function (error) {
                    console.log(error);
                    callback(null, "Failed to save round data");
                });
        },
        listRounds: function (callback) {

            var deviceId = this.getDeviceId;

            $http.get('/api/rounds/headers?deviceId=' + deviceId())
                .success(function (data) {
                    callback(data);
                })
                .error(function (error) {
                    callback(null, "Failed to load rounds");
                });
        },
        getDeviceId: function () {
            var id = window.localStorage.getItem("caddie.deviceId");

            if (!id) {
                id = Math.random().toString(36).substring(7);
                window.localStorage.setItem("caddie.deviceId", id);
            }

            return id;
        },
        calculateStrokes: function () {

            var strokes = 0;
            var gamePar = 0;

            if (!currentRound || !currentRound.data) {
                return;
            }

            angular.forEach(currentRound.data.holes, function (hole) {

                if (hole.strokes && hole.strokes != "-") {
                    strokes += hole.strokes;
                    gamePar += hole.gamePar;
                }
                else if (hole.strokes == "-") {
                    strokes += (hole.gamePar + 2);
                    gamePar += hole.gamePar;
                }

            });

            currentRound.data.strokes = strokes;
            currentRound.data.toPar = strokes - gamePar;
        },
        getRoundData : function(id, callback) {
            $http.get('/api/rounds/' + id)
                .success(function(data) {
                   callback(data);
                })
                .error(function() {
                   callback(null, "Failed to load round data");
                });
        }
    }
}]);

services.factory('CalcService', [function () {

    var hcpLevels = [
        {
            min: 0,
            max: 4.4,
            buffer: 35,
            up: 0.1,
            down: 0.1
        },
        {
            min: 4.5,
            max: 11.4,
            buffer: 34,
            up: 0.1,
            down: 0.2
        },
        {
            min:11.5,
            max: 18.4,
            buffer: 33,
            up: 0.1,
            down: 0.3
        },
        {
            min: 18.5,
            max: 26.4,
            buffer: 32,
            up: 0.1,
            down: 0.4
        },
        {
            min: 26.5,
            max: 36.0,
            buffer: 31,
            up: 0.2,
            down: 0.5
        },
        {
            min: 37.0,
            max: 54.0,
            buffer: 0,
            up: 0,
            down: 1
        }

    ]

    return {
        calculateGameHcp: function (hcp, slope, cr, par) {

            if (hcp && slope && cr && par) {
                return Math.round(hcp * (slope / 113) + (cr - par));
            }
            else {
                return null;
            }
        },
        calculateNewHcp : function(hcp, bogeyPoints) {

            var level = hcpLevels[0];

            angular.forEach(hcpLevels, function(next) {
               if(hcp >= next.min && hcp <= next.max) {
                   level = next;
               }
            });

            if(bogeyPoints > 36) {
                var bogeyDiff = 36 - bogeyPoints;
                return hcp - (bogeyDiff*level.down);
            }
            else if(bogeyPoints < level.buffer) {
                return hcp + level.up;
            }
            else {
                return hcp;
            }
        },
        calculateBogeyPoints : function(holes) {
            var points = 0;

            angular.forEach(holes, function(hole) {
               if(hole.strokes) {
                   points += Math.max(0, (hole.gamePar+2)-hole.strokes);
               }
            });

            return points;
        },
        analyseRound: function (roundData) {

            var analysis = {holesPlayed: 0};
            analysis.holes = roundData.holes;
            analysis.openings = {left: 0, fair: 0, right: 0, hazard: 0, out: 0, total: 0};
            analysis.toGreen = {3: {total: 0, sum: 0}, 4: {total: 0, sum: 0}, 5: {total: 0, sum: 0}};
            analysis.puts = {3: {total: 0, sum: 0}, 4: {total: 0, sum: 0}, 5: {total: 0, sum: 0}};
            analysis.average = {3: {total: 0, sum: 0, count: 0}, 4: {total: 0, sum: 0, count: 0}, 5: {total: 0, sum: 0, count: 0}};

            angular.forEach(roundData.holes, function (hole) {
                if (hole.strokes) {
                    var strokes = hole.strokes;

                    if (hole.strokes == "-") {
                        strokes = hole.gamePar + 2;
                    }

                    analysis.holesPlayed++;
                    analysis.average[hole.par].count++;
                    analysis.average[hole.par].total += hole.gamePar;
                    analysis.average[hole.par].sum += strokes;

                    if (hole.puts && hole.puts != "-") {

                        analysis.toGreen[hole.par].total++;
                        analysis.toGreen[hole.par].sum += (strokes - hole.puts);
                        analysis.puts[hole.par].total++;
                        analysis.puts[hole.par].sum += hole.puts;
                    }
                }

                if (hole.opening) {
                    analysis.openings[hole.opening]++;
                    analysis.openings["total"]++;

                    if (hole.openingDesc) {
                        analysis.openings[hole.openingDesc]++;
                    }
                }

            });

            return analysis;
        }
    }
}]);

services.factory('ProfileService', [function () {

    var allClubs = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "PW", "GW", "SW", "LW"];

    var clubs = {
        woods: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
        irons: ["I3", "I4", "I5", "I6", "I7", "I8", "I9"],
        wedges: ["PW", "GW", "SW", "LW"]
    };

    return {
        listAllClubs: function () {
            return clubs;
        },
        getClubs: function () {
            var profileClubs = window.localStorage.getItem("caddie.profile.clubs");

            if (profileClubs) {
                return JSON.parse(profileClubs);
            }
            else {
                return {
                    opening: angular.copy(allClubs),
                    approach: angular.copy(allClubs),
                    chip: angular.copy(allClubs)
                }
            }
        },
        saveClubSelection: function (clubs) {
            clubs.opening = _.sortBy(clubs.opening, clubSort);
            clubs.approach = _.sortBy(clubs.approach, clubSort);
            clubs.chip = _.sortBy(clubs.chip, clubSort);

            window.localStorage.setItem("caddie.profile.clubs", JSON.stringify(clubs));
        },
        resetClubSelection: function () {
            window.localStorage.removeItem("caddie.profile.clubs");
        },
        getChipClubs: function () {
            return this.getClubs().chip;
        },
        getOpeningClubs: function () {
            return this.getClubs().opening;
        },
        getApproachClubs: function () {
            return this.getClubs().approach;
        }


    }

    function clubSort(club) {
        return allClubs.indexOf(club);
    }
}]);

services.factory('ErrorService', [function () {

    var errors = [];

    return {
        logError: function (message, url, lineNumber) {
            errors.push({message: message, url: url, lineNumber: lineNumber, timestamp: new Date()});
            return false;
        },
        errors: errors
    }
}]);
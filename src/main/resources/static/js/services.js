var services = angular.module('services', []);

services.factory('CourseService', ['$http', 'ErrorService', function ($http, $resource, errorService) {

    return {
        listClubs: function (callback) {
            callback(["Hill Side Valley", "Paloheina Golf", "Vihti Golf"]);
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

services.factory('RoundService', ['$http', function ($http) {

    var currentRound = null;


    return {
        loadCurrentRound: function () {
            var loaded = window.localStorage.getItem("caddieRound");

            if (loaded && loaded != 'undefined') {
                currentRound = JSON.parse(loaded);
            }

            return currentRound;
        },
        cacheCurrentRound: function () {
            if (currentRound != null) {
                window.localStorage.setItem("caddieRound", JSON.stringify(currentRound));
            }
        },
        getCurrentRound: function () {
            return currentRound;
        },
        newRound: function () {
            window.localStorage.removeItem("caddieRound");
            currentRound = null;
        },
        startRound: function (selectedCourse) {
            currentRound = {};
            currentRound.caption = selectedCourse.courseName;
            currentRound.timestamp = new Date();
            currentRound.data = {};

            currentRound.data = angular.copy(selectedCourse);
            this.cacheCurrentRound();
            return currentRound;
        },
        saveRoundData: function (callback) {

            var request = angular.copy(currentRound);
            request.deviceId = this.getDeviceId();
            request.data = JSON.stringify(currentRound.data);

            var caching = this.cacheCurrentRound;

            $http.post('/api/rounds/', request)
                .success(function (storedId) {
                    currentRound.id = storedId;
                    caching();
                    callback();
                })
                .error(function (error) {
                    console.log(error);
                    callback("Failed to save round data");
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

            currentRound.strokes = strokes;
            currentRound.toPar = strokes - gamePar;
        }
    }
}]);

services.factory('CalcService', [function () {

    return {
        calculateGameHcp: function (hcp, slope, cr, par) {

            if (hcp && slope && cr && par) {
                return Math.round(hcp * (slope / 113) + (cr - par));
            }
            else {
                return null;
            }
        },
        analyseRound: function (roundData) {

            var analysis = {holesPlayed: 0};
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
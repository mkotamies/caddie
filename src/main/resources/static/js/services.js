var services = angular.module('services', ['ngResource']);

services.factory('CourseService', ['$http', '$resource', 'ErrorService', function ($http, $resource, errorService) {

    return {
        listClubs: function (callback) {
            callback(["Hill Side Valley", "Paloheinä Golf", "Vihti Golf"]);
        },
        getClubData: function (club, callback) {

            $http.get('./clubs.json')
                .success(function (data) {

                    callback(_.find(data, function (elem) {
                        return elem.name == club;
                    }));
                })
                .error(function (error) {
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
        saveRoundData : function(callback   ) {

            var request = angular.copy(currentRound);
            request.deviceId = getDeviceId();
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
        listRounds : function(callback) {
            $http.get('/api/rounds/headers?deviceId=' + getDeviceId())
                .success(function (data) {
                    callback(data);
                })
                .error(function (error) {
                    callback(null, "Failed to load rounds");
                });
        }
    }

    function getDeviceId() {
        var id = window.localStorage.getItem("caddie.deviceId");

        if (!id) {
            id = Math.random().toString(36).substring(7);
            window.localStorage.setItem("caddie.deviceId", id);
        }

        return id;
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
        }
    }
}]);

services.factory('ErrorService', [function () {

    var errors = [];

    return {
        logError : function(message, url, lineNumber) {
            errors.push({message:message,url:url,lineNumber:lineNumber,timestamp:new Date()});
            return false;
        },
        errors : errors
    }
}]);
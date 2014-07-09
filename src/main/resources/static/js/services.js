var services = angular.module('services', ['ngResource']);

services.factory('CourseService', ['$http', '$resource', function($http, $resource) {

    return {
        listClubs : function(callback) {
             callback(["Hill Side Valley", "Paloheinä Golf", "Vihti Golf"]);
        },
        getClubData : function(club, callback) {

            $http.get('./clubs.json')
                .success(function(data) {
                    callback(_.find(data, function(elem) {return elem.name == club;}))
                })
                .error(function(error) {callback("Failed to load club info!")})
        },
        saveHcp : function(hcp) {
            window.localStorage.setItem("caddieHcp", hcp);
        },
        loadHcp : function() {
            return window.localStorage.getItem("caddieHcp");
        }
    }
}]);

services.factory('RoundService', ['$http', function($http) {

    var currentRound = null;

    return {
    	loadCurrentRound : function() {
    		var loaded = window.localStorage.getItem("caddieRound");

    		if(loaded && loaded != 'undefined') {
    			currentRound = JSON.parse(loaded);
    		}

            return currentRound;
    	},
    	saveCurrentRound : function() {
            if(currentRound != null) {
                window.localStorage.setItem("caddieRound", JSON.stringify(currentRound));
            }
    	},
        getCurrentRound : function() {
            return currentRound;
        },
        newRound : function() {
            window.localStorage.removeItem("caddieRound");
            currentRound = null;
        },
        startRound : function(selectedCourse) {
            currentRound = angular.copy(selectedCourse);
            this.saveCurrentRound();
            return currentRound;
        },
        getStoredEmail : function() {
            return window.localStorage.getItem("caddie.email");
        },
        sendRoundData : function(email, callback) {

            var request = {mail : email, data : currentRound};

            $http.post('/api/rounds/', request)
                .success(function() {
                    callback();
                })
                .error(function() {
                    callback("Failed to send round data");
                });

            window.localStorage.setItem("caddie.email", email);
        }
    }
}]);

services.factory('CalcService', [function() {

    return {
        calculateGameHcp : function(hcp, slope, cr, par) {

            if(hcp && slope && cr && par) {
                return Math.round(hcp * (slope / 113) + (cr - par));
            }
            else {
                return null;
            }
        }
    }
}]);
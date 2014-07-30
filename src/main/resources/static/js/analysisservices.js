var services = angular.module('analysisservices', ['services']);

services.factory('AnalysisRepository', ['RoundService', function (roundService) {

    var performedAnalysis = {};

    return {
        analysisForRound : function(roundId, callback) {
            var performed = performedAnalysis[roundId];

            if(performed) {
                callback(performed);
            }
            else {
                roundService.getRoundData(roundId, function(data, error) {
                    if(error) {
                        callback(null, error);
                    }
                    else {
                        var newAnalysis = {roundData : data};
                        newAnalysis.analysis = analyseRound(newAnalysis.roundData.data);
                        performedAnalysis[roundId] = newAnalysis;
                        callback(newAnalysis);
                    }
                });
            }
        }
    }

    function analyseRound(roundData) {

        function AvgEntry () {
            this.sum = 0;
            this.count = 0;
        }

        AvgEntry.prototype.addEntry = function(value) {
            this.sum += value;
            this.count++;
        }

        AvgEntry.prototype.avg = function(decimals) {
            return Math.round((this.sum / this.count) * (decimals*10)) / (decimals*10);
        }

        function HoleEntry() {
            this.values = [new AvgEntry(), new AvgEntry(), new AvgEntry()];
        }

        HoleEntry.prototype.addEntry = function(par, value) {
            this.values[par-3].addEntry(value);
        }

        HoleEntry.prototype.avgs = function() {
            return [this.values[0].avg(2), this.values[1].avg(2), this.values[2].avg(3)];
        }

        var analysis = {holesPlayed: 0};
        var approaches = new HoleEntry();
        var chipData = new HoleEntry();
        var toGreen = new HoleEntry();
        var putData = new HoleEntry();
        var averageData = new HoleEntry();

        angular.forEach(roundData.holes, function (hole) {
            if (hole.strokes) {
                var strokes = hole.strokes;
                var puts = hole.puts ? hole.puts.length : 0;
                var chips = hole.chip ? hole.chip.length : 0;
                var approach = hole.approach ? hole.approach.length : 0;
                var opening = hole.opening ? hole.opening.length : 0;

                if (hole.strokes == "-") {
                    strokes = hole.gamePar + 2;
                }

                analysis.holesPlayed++;

                approaches.addEntry(hole.par, strokes - puts - chips);
                chipData.addEntry(hole.par, chips);
                toGreen.addEntry(hole.par, strokes - puts);
                putData.addEntry(hole.par, puts);
                averageData.addEntry(hole.par, strokes - hole.gamePar);
            }

        });

        analysis.approach = approaches.avgs();
        analysis.chips = chipData.avgs();
        analysis.togreen = toGreen.avgs();
        analysis.puts = putData.avgs();
        analysis.totals = averageData.avgs();

        return analysis;
    }


}]);
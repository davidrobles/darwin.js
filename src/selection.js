var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Selection = {
        randomTopPercent: function(evaluatedPopulation) {
            var randIndex = Darwin.Utils.randomIntFromInterval(0, (evaluatedPopulation.length / 2) -1);
            return evaluatedPopulation[randIndex];
        },
        // Also known as fitness proportionate selection
        routletteWheelSelection: function(evalPop) {
        },
        tournamentSelection: function(evalPop) {
        },
        rankSelection: function(evalPop) {
        },
        boltzmannSelection: function(evalPop) {
        },
    };

})();

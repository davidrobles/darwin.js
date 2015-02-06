var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Selection = {
        randomTopPercent: function(evaluatedPopulation) {
            var randIndex = _.random(0, (evaluatedPopulation.length / 2) -1);
            return evaluatedPopulation[randIndex];
        },
        // Also known as fitness proportionate selection
        routletteWheelSelection: function(evalPop) {
            // TODO
        },
        tournamentSelection: function(evalPop) {
            // TODO
        },
        rankSelection: function(evalPop) {
            // TODO
        },
        boltzmannSelection: function(evalPop) {
            // TODO
        }
    };

})();
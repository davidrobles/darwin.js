var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Selection = {
        randomTopPercent: function(evaluatedPopulation) {
            // TODO get percentage as a parameter
            evaluatedPopulation = _.clone(evaluatedPopulation);
            evaluatedPopulation.sort(function(a, b) {
                return b.fitness - a.fitness;
            });
            var randIndex = _.random(0, (evaluatedPopulation.length / 5) -1);
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
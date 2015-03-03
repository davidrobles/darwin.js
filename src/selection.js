var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Selection = {
        randomTopPercent: function(population) {
            // TODO get percentage as a parameter
            population = _.clone(population);
            population.sort(function(a, b) {
                return b.fitness - a.fitness;
            });
            var randIndex = _.random(0, (population.length / 5) -1);
            return population[randIndex];
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
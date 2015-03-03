var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.Selection = {

        createRandomTopPercent: function(percentage) {
            return function(population) {
                population = _.clone(population);
                population.sort(function(a, b) {
                    return b.fitness - a.fitness;
                });
                var topSize = Math.round(population.length * percentage);
                var randIndex = _.random(0, topSize - 1);
                return _.clone(population[randIndex].genotype);
            }
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
        }

    };

})(Darwin);
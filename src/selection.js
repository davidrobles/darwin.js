var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.Selection = {

        createTopRankSelection: function(percentage) {
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

        // TODO implement binary search, right now is just O(n)
        binarySearch: function(cumulativeFitnesses, fitness) {
            var index = 0;
            for (var i = 0; i < cumulativeFitnesses.length; i++) {
                if (fitness <= cumulativeFitnesses[i])  {
                    index = i;
                    break;
                }
            }
            return index;
        },

        // Also known as fitness proportionate selection
        // TODO make just one call to this method
        fitnessProportionalSelection: function(population) {
            var cumulativeFitnesses = [population[0].fitness];
            for (var i = 1; i < population.length; i++) {
                cumulativeFitnesses[i] = cumulativeFitnesses[i - 1] + population[i].fitness;
            }
            var randomFitness = Math.random() * cumulativeFitnesses[cumulativeFitnesses.length - 1];
            var index = Darwin.Selection.binarySearch(cumulativeFitnesses, randomFitness);
            return _.clone(population[index].genotype);
        },

        tournamentSelection: function(population) {
            // TODO
        },

        rankSelection: function(population) {
            // TODO
        }

    };

})(Darwin);
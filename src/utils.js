var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Utils = {

        // TODO assumes the best fitness is a high value (not always true!)
        // TODO what if more than one individual have the best fitness?
        generateStats: function(population) {
            var totalFitness = 0,
                bestIndividual = null,
                worstIndividual = null;
            _.each(population, function(individual) {
                totalFitness += individual.fitness;
                if (!bestIndividual || individual.fitness > bestIndividual.fitness) {
                    bestIndividual = individual;
                }
                if (!worstIndividual || individual.fitness < worstIndividual.fitness) {
                    worstIndividual = individual;
                }
            });
            var average = totalFitness / population.length;
            return {
                averageFitness: average,
                bestIndividual: bestIndividual.genotype, // TODO Pass the entire individual?
                bestIndividualFitness: bestIndividual.fitness,
                worstIndividualFitness: worstIndividual.fitness,
                population: population
            };
        },

        shouldContinue: function(popData, conditions) {
            return _.every(conditions, function(condition) {
                return !condition.shouldTerminate(popData);
            });
        },

        shouldTerminate: function(popData, conditions) {
            return _.some(conditions, function(condition) {
                return condition.shouldTerminate(popData);
            });
        }

    };

})();

var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.Utils = {

        // TODO assumes the best fitness is a high value (not always true!)
        // TODO what if more than one individual have the best fitness?
        generateStats: function(population) {
            var totalFitness = 0,
                bestIndividual = null,
                worstIndividual = null;
            var diff = 0;
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
            // TODO Refactor, use_.reduce() ?
            _.each(population, function(individual) {
                diff += Math.pow(individual.fitness - average, 2);
            });
            var variance = diff / population.length;
            var std = Math.sqrt(variance);
            return {
                averageFitness: average, // TODO rename
                stdFitness: std, // TODO rename
                bestIndividual: bestIndividual,
                worstIndividual: worstIndividual,
                population: population
            };
        },

        shouldTerminate: function(population, terminationConditions) {
            return _.some(terminationConditions, function(condition) {
                return condition(population);
            });
        }

    };

})(Darwin);
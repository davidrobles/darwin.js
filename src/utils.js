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
            var diff = _.reduce(population, function(memo, individual) {
                return memo + Math.pow(individual.fitness - average, 2)
            }, 0);
            var variance = diff / population.length;
            var std = Math.sqrt(variance);
            return {
                fitnessAvg: average,
                fitnessStd: std,
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
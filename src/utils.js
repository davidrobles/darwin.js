var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Utils = {

        generateStats: function(evaluatedPopulation) {
            var totalFitness = evaluatedPopulation.map(function(individual) {
                return individual.fitness;
            }).reduce(function(prev, cur) {
                return prev + cur;
            });
            var average = totalFitness / evaluatedPopulation.length;
            return {
                averageFitness: average,
                bestIndividual: evaluatedPopulation[0].individual,
                bestIndividualFitness: evaluatedPopulation[0].fitness,
                population: evaluatedPopulation // sorted from best to worst?
            };
        },

        evaluatePopulation: function(population, fitnessFunction) {
            var index = 0; // TODO hacky, fix it
            return _.map(population, function(individual) {
                return {
                    id: index++,
                    individual: individual,
                    fitness: fitnessFunction(individual)
                };
            });
        },

        generatePopulation: function(individualFactory, popSize) {
            return _.map(_.range(popSize), function() {
                return individualFactory();
            });
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

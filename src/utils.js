var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Utils = {

        generateStats: function(evaluatedPopulation) {
            var totalFitness = evaluatedPopulation.map(function(candidate) {
                return candidate.fitness;
            }).reduce(function(prev, cur) {
                return prev + cur;
            });
            var average = totalFitness / evaluatedPopulation.length;
            return {
                averageFitness: average,
                bestCandidate: evaluatedPopulation[0].candidate,
                bestCandidateFitness: evaluatedPopulation[0].fitness,
                population: evaluatedPopulation // sorted from best to worst?
            };
        },

        evaluatePopulation: function(population, fitnessFunction) {
            var index = 0; // TODO hacky, fix it
            return _.map(population, function(candidate) {
                return {
                    id: index++,
                    candidate: candidate,
                    fitness: fitnessFunction(candidate)
                };
            });
        },

        generatePopulation: function(candidateFactory, popSize) {
            return _.map(_.range(popSize), function() {
                return candidateFactory();
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

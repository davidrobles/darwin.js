var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Utils = {

        evaluatePopulation: function(population, fitnessFunction) {
            return _.map(population, function(candidate) {
                return {
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

        randomIntFromInterval: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
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

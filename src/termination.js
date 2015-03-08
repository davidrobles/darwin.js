var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.Termination = {};

    Darwin.Termination.createTargetFitnessCondition = function(targetFitness) {
        return function(population) {
            return population.bestIndividual.fitness >= targetFitness;
        }
    };

    Darwin.Termination.createMaxGenerationsCondition = function(maxGens) {
        if (maxGens < 1) {
            throw "Max number of generations must be at least 1"
        }
        return function(population) {
            return maxGens - 1 === population.id;
        }
    };

})(Darwin);
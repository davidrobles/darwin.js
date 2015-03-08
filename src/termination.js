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
        return function(population) {
            // TODO fix this
            return maxGens === population.id;
        }
    };

})(Darwin);
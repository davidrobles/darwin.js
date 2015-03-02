var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Termination = {};

    Darwin.Termination.TargetFitness = function(targetFitness) {
        this.targetFitness = targetFitness;
    };

    Darwin.Termination.TargetFitness.prototype.shouldTerminate = function(populationData) {
        return populationData.bestIndividual.fitness >= this.targetFitness;
    };

    Darwin.Termination.MaxNumGens = function(numGens) {
        this.numGens = numGens;
    };

    Darwin.Termination.MaxNumGens.prototype.shouldTerminate = function(populationData) {
        return this.numGens - 1 == populationData.generation;
    };

    Darwin.Termination.Stagnation = function(generationLimit, naturalFitness) {
        this.generationLimit = generationLimit;
        this.naturalFitness = naturalFitness;
    };

    Darwin.Termination.Stagnation.prototype.shouldTerminate = function(populationData) {

    };

})();

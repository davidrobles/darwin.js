Darwin.Termination = {};

Darwin.Termination.TargetFitness = function(targetFitness) {
    this.targetFitness = targetFitness;
}

Darwin.Termination.TargetFitness.prototype.shouldTerminate = function(populationData) {
    return populationData.bestCandidateFitness >= this.targetFitness;
}

Darwin.Termination.MaxNumGens = function(numGens) {
    this.numGens = numGens;
}

Darwin.Termination.MaxNumGens.prototype.shouldTerminate = function(populationData) {
    return this.numGens - 1 == populationData.generation;
}

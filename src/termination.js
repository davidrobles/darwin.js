Darwin.Termination = {};

Darwin.Termination.TargetFitness = function(targetFitness) {
	this.targetFitness = targetFitness;
}

Darwin.Termination.TargetFitness.prototype = function(populationData) {
	return populationData.bestCandidateFitness >= this.targetFitness;
}

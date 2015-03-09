var ImageEvolution = {

    createImageFitnessFunction: function(targetFitness, imageData, numPixels) {
        return function (individual) {
            var fitness = targetFitness;
            for (var i = 0; i < numPixels; i++) {
                fitness -= Math.abs(individual.genotype[i * 4] - imageData.data[i * 4]);
                fitness -= Math.abs(individual.genotype[i * 4 + 1] - imageData.data[i * 4 + 1]);
                fitness -= Math.abs(individual.genotype[i * 4 + 2] - imageData.data[i * 4 + 2]);
                fitness -= Math.abs(individual.genotype[i * 4 + 3] - imageData.data[i * 4 + 3]);
            }
            return fitness;
        }
    }

};
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
    },

    createRandomImageFromColorPool: function(colorsPool, numPixels) {
        return function() {
            var data = [];
            for (var i = 0; i < numPixels; i++) {
                var colorIndex = Math.floor(Math.random() * colorsPool.length);
                var randomColor = colorsPool[colorIndex];
                data[i * 4] = randomColor[0];
                data[i * 4 + 1] = randomColor[1];
                data[i * 4 + 2] = randomColor[2];
                data[i * 4 + 3] = randomColor[3];
            }
            return data;
        };
    }

};
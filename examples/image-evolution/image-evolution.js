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
    },

    createImageView: function(targetImageEl) {
        return Backbone.View.extend({
            tagName: "img",
            initialize: function(options) {
                this.actual = options.actual;
            },
            render: function() {
                var newCanvas = document.createElement('canvas');
                debugger;
                newCanvas.height = targetImageEl.height;
                newCanvas.width = targetImageEl.width;
                var newCtx = newCanvas.getContext('2d');
                var imageData = newCtx.getImageData(0, 0, newCanvas.width, newCanvas.height);
                for (var i = 0; i < this.actual.length; i++) {
                    imageData.data[i] = this.actual[i];
                }
                newCtx.putImageData(imageData, 0, 0);
                this.el.src = newCanvas.toDataURL("image/png");
                this.el.width = 32;
                this.el.height = 32;
                return this;
            }
        });
    },

    createColorMutation: function(colorsPool, numPixels) {
        return function(individual, mutationRate) {
            individual = _.clone(individual);
            for (var i = 0; i < numPixels; i++) {
                if (Math.random() < mutationRate) {
                    var colorIndex = Math.floor(Math.random() * colorsPool.length);
                    var randomColor = colorsPool[colorIndex];
                    individual[i * 4] = randomColor[0];
                    individual[i * 4 + 1] = randomColor[1];
                    individual[i * 4 + 2] = randomColor[2];
                    individual[i * 4 + 3] = randomColor[3];
                }
            }
            return individual;
        }
    },

    createImageCrossover: function(numPixels) {
        return function(parentA, parentB) {
            var crossoverPoint = _.random(0, numPixels);
            var outcomeA = _.clone(parentA);
            var outcomeB = _.clone(parentB);
            for (var i = 0; i < numPixels; i++) {
                if (i > crossoverPoint) {
                    outcomeA[i * 4] = parentB[i * 4];
                    outcomeA[i * 4 + 1] = parentB[i * 4 + 1];
                    outcomeA[i * 4 + 2] = parentB[i * 4 + 2];
                    outcomeA[i * 4 + 3] = parentB[i * 4 + 3];
                    outcomeB[i * 4] = parentA[i * 4];
                    outcomeB[i * 4 + 1] = parentA[i * 4 + 1];
                    outcomeB[i * 4 + 2] = parentA[i * 4 + 2];
                    outcomeB[i * 4 + 3] = parentA[i * 4 + 3];
                }
            }
            return {
                childA: outcomeA,
                childB: outcomeB
            };
        }
    }

};
Darwin.Utils = {
    evaluatePopulation: function(population, fitnessFunction) {
        return population.map(function(candidate) {
            return {
                candidate: candidate,
                fitness: fitnessFunction(candidate)
            };
        });
    },
    generatePopulation: function(genIndFunc, popSize) {
        var population = [];
        for (var i = 0; i < popSize; i++) {
            population.push(genIndFunc());
        }
        return population;
    },
    randomIntFromInterval: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

Darwin.Utils = {
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

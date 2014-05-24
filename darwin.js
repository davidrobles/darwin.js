/**
 * Generates a population of popSize individuals based
 * in the genIndfunc function.
 * @param genIndFunc
 * @param popSize
 */
function generatePopulation(genIndFunc, popSize) {
    // var population = [];
    // for (var i = 0; i < popSize; i++) {
    //     population.push(genIndFunc());
    // }
    // return population;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

///////////////////////
// Selection methods //
///////////////////////

function randomTopPercent(evaluatedPopulation) {
    intValue = randomIntFromInterval(0, (evaluatedPopulation.length / 2) -1);
    return evaluatedPopulation[intValue];
}

///////////////////////////
// Recombination methods //
///////////////////////////

function reproduce(parentA, parentB) {
    // verify certain initial condition
    var c = randomIntFromInterval(0, parentA.length);
    var first = parentA.substr(0, c) + parentB.substr(c, parentA.length);
    // var second = parentA.substr(0, c) + parentB.substr(c, parentA.length);
    // return [first, second];
    return first;
}

///////////////////////
// GENETIC ALGORITHM //
///////////////////////

function GA(opts) {
	this.opts = opts || {};
    this.populationSize = opts.populationSize;
    this.fitnessFunction = opts.fitnessFunction;
    this.genIndFunc = opts.genIndFunc;
    this.numGens = opts.numGens;
    this.generation = 0;
    this.observers = opts.observers;
}

GA.prototype = {
    evaluatePopulation: function() {
        var self = this;
        return this.population.map(function(candidate) {
            return {
                candidate: candidate,
                fitness: self.fitnessFunction(candidate)
            };
        });
    },
    newPopulations: function() {
        var self = this;
        return this.population.map(function(candidate) {
            var parentA = randomTopPercent(self.evaluatedPopulation);
            var parentB = randomTopPercent(self.evaluatedPopulation);
            var offspring = reproduce(parentA.candidate, parentB.candidate); // remove .candidate
            return offspring;
        });
    },
    evolutionaryStep: function() {
        this.fire('generationStart');
        this.evaluatedPopulation = this.evaluatePopulation();
        this.fire('populationEvaluated');
        this.evaluatedPopulation.sort(function(a, b) {
            return b.fitness - a.fitness;
        });
        this.fire('populationSorted');
        this.population = this.newPopulations();
        this.fire('generationFinish');
        this.generation++;
        if (this.generation >= this.numGens) { // temp fix
            clearInterval(this.interval);
        }
    },
    fire: function(notification) {
		var observersLength = this.observers.length;
        for (var i = 0; i < observersLength; i++) {
            this.observers[i](this, notification);
        }
    },
    reset: function() {
        this.population = [];
        this.evaluatedPopulation = [];
    },
    run: function() {
        this.population = generatePopulation(this.genIndFunc, this.populationSize);
        this.generation = 0;
        this.interval = setInterval(jQuery.proxy(this, 'evolutionaryStep'), 100);
    }
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function hello() {
    console.log('hello');
}

(function() {
    function createWordFitnessFunction(targetWord) {
        return function fitnessFunc(actualWord) {
            var total = 0;
			var actualWordLength = actualWord.length;
            for (var i = 0; i < actualWordLength; i++) {
                if (actualWord.charAt(i) == targetWord.charAt(i)) {
                    total++;
                }
            }
            return total;
        }
    }

    function createRandomWordGenerator(wordLength) {
        return function generateRandomWord() {
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ",
                word = "";
            for (var i = 0; i < wordLength; i++) {
                chara = randomIntFromInterval(0, alphabet.length);
                word += alphabet.charAt(chara);
            }
            return word
        }
    }

    function myObserver(ga, notification) {
        switch (notification) {
            case "generationStart":
                console.log('------------------');
                console.log('Generation ' + (ga.generation + 1));
                break;
            case "generationFinish":
                var all = ga.evaluatedPopulation.map(function(value) {
                    return value.fitness;
                });
                var first = all.reduce(function(prev, cur) {
                    return prev + cur;
                });
                var average = first / ga.evaluatedPopulation.length;
                var results = $("#results");
                var line = "<tr>";
                line += "<td>" + (ga.generation + 1) + "</td>";
                line += "<td>" + ga.population[0] + "</td>";
                line += "<td>" + ga.fitnessFunction(ga.population[0]) + "</td>";
                line += '<td style="background-color: rgba(255, 0, 0, '
                    + (average / 36) + '">' + average + "</td>";
                line += "</tr>";
                results.append(line);
                break;
        }
    }

    var wordToFind = "THIS IS A TEST ON GENETIC ALGORITHMS";

    $("#bestFitness").html(wordToFind.length);

    ga = new GA({
        selectionMethod: null,
        numGens: 100,
        populationSize: 1000,
        genIndFunc: createRandomWordGenerator(wordToFind.length),
        fitnessFunction: createWordFitnessFunction(wordToFind),
        observers: [myObserver]
    });

    // ga.run();

	var names = ['David', 'Pepe', 'Natalia', 'Raul'];
	console.log('The names are:');
	names.forEach(function(name) {
		console.log(name);
	});

})();


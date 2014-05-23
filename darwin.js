
// change num of generations to a more general condition checker
// add validations in constructor function
// what are the types of fitnesses? only numeric?
// configuration object to define notifications? all?
// monitor fitness evaluation? useful in GA's like the bike evolution
// save stats of each generation and display it
// reproduce two by two

var DARWIN = DARWIN || {};

/**
 * Generates a population of popSize individuals based
 * in the genIndfunc function.
 * @param genIndFunc
 * @param popSize
 */
function generatePopulation(genIndFunc, popSize) {
    var population = [];
    for (var i = 0; i < popSize; i++) {
        population.push(genIndFunc());
    }
    return population;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/*********************
 * Selection methods *
 *********************/

function randomTopPercent(evaluatedPopulation) {
    intValue = randomIntFromInterval(0, (evaluatedPopulation.length / 2) -1);
    return evaluatedPopulation[intValue];
}

function reproduce(x, y) {
    // verify certain initial condition
    var c = randomIntFromInterval(0, x.length);
    var first = x.substr(0, c) + y.substr(c, x.length);
    // var second = x.substr(0, c) + y.substr(c, x.length);
    // return [first, second];
    return first;
}


///////////////////////
// GENETIC ALGORITHM //
///////////////////////

function GA(settings) {
    this.populationSize = settings.populationSize;
    this.fitnessFunction = settings.fitnessFunction;
    this.genIndFunc = settings.genIndFunc;
    this.numGens = settings.numGens;
    this.generation = 0;
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
            var x = randomTopPercent(self.evaluatedPopulation);
            var y = randomTopPercent(self.evaluatedPopulation);
            var offspring = reproduce(x.candidate, y.candidate); // remove .candidate
            return offspring;
        });
    },
    evolutionaryStep: function() {
        console.log('-------------------');
        console.log("Generation " + (this.generation + 1));
        this.evaluatedPopulation = this.evaluatePopulation();
        console.log("Population evaluated");
        this.evaluatedPopulation.sort(function(a, b) {
            return b.fitness - a.fitness;
        });
        this.population = this.newPopulations();
        console.log('Best: ' + this.population[0]);
        console.log('Fitness: ' + this.fitnessFunction(this.population[0]));
    },
    reset: function() {
        this.population = [];
        this.evaluatedPopulation = [];
    },
    run: function() {
        this.population = generatePopulation(this.genIndFunc, this.populationSize);
        this.generation = 0;
        while (this.generation < this.numGens) {
            this.evolutionaryStep();
            this.generation++;
        }
    }
};

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

(function() {
    function createWordFitnessFunction(targetWord) {
        return function fitnessFunc(actualWord) {
            var total = 0;
            for (var i = 0; i < actualWord.length; i++) {
                if (actualWord.charAt(i) == targetWord.charAt(i)) {
                    total++;
                }
            }
            return total;
        }
    }

    var wordToFind = "HELLO WORLD";

    ga = new GA({
        numGens: 100,
        populationSize: 500,
        genIndFunc: createRandomWordGenerator(wordToFind.length),
        fitnessFunction: createWordFitnessFunction(wordToFind)
    });

    ga.run();
})();


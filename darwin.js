
// change num of generations to a more general condition checker
// add validations in constructor function
// what are the types of fitnesses? only numeric?
// configuration object to define notifications? all?
// monitor fitness evaluation? useful in GA's like the bike evolution
// save stats of each generation and display it

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

///////////////////////
// GENETIC ALGORITHM //
///////////////////////

function GA(settings) {
    this.populationSize = settings.populationSize;
    this.fitnessFunction = settings.fitnessFunction;
    this.genIndFunc = settings.genIndFunc;
    this.numGens = settings.numGens;
}

GA.prototype = {
    evaluatePopulation: function() {
        var evaluatedPopulation = [];
        for (var i = 0; i < this.population.length; i++) {
            evaluatedPopulation.push({
                candidate: this.population[i],
                fitness: this.fitnessFunction(this.population[i])
            });
        }
        return evaluatedPopulation;
    },
    newPopulations: function() {
        var newPopulation = [];
        for (var j = 0; j < this.population.length; j++) {
            var x = randomTopPercent(this.evaluatedPopulation);
            var y = randomTopPercent(this.evaluatedPopulation);
            var offspring = reproduce(x.candidate, y.candidate); // remove .candidate
            newPopulation.push(offspring);
        }
        return newPopulation;
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

var numGens = 100,
    popSize = 500,
    wordToFind = "HELLO WORLD",
    genIndFunc = createRandomWordGenerator(wordToFind.length), 
    fitnessFunction = createWordFitnessFunction(wordToFind);

// run_ga(numGens, genIndFunc, popSize, fitnessFunction);

ga = new GA({
    numGens: 100,
    populationSize: 500,
    genIndFunc: createRandomWordGenerator(wordToFind.length),
    fitnessFunction: createWordFitnessFunction(wordToFind)
});

ga.run();


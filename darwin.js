
// change num of generations to a more general condition checker
// add validations in constructor function

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
    run: function() {
        this.population = generatePopulation(this.genIndFunc, this.populationSize);
        for (var i = 0; i < this.numGens; i++) {
            console.log('-------------------');
            console.log("Generation " + (i + 1));
            var newPopulation = [];
            var evaluatedPopulation = this.evaluatePopulation();
            evaluatedPopulation.sort(function(a, b) {
                return b.fitness - a.fitness;
            });
            for (var j = 0; j < this.population.length; j++) {
                var x = randomTopPercent(evaluatedPopulation);
                var y = randomTopPercent(evaluatedPopulation);
                var child = reproduce(x.candidate, y.candidate); // remove .candidate
                newPopulation.push(child);
            }
            this.population = newPopulation;
            console.log('Best: ' + this.population[0]);
            console.log('Fitness: ' + this.fitnessFunction(this.population[0]));
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


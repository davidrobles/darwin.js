
// change num of generations to a more general condition checker

var DARWIN = DARWIN || {};

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

function evaluatePopulation(population, fitnessFunction) {
    var evaluatedPopulation = [];
    for (var i = 0; i < population.length; i++) {
        evaluatedPopulation.push({
            candidate: population[i],
            fitness: fitnessFunction(population[i])
        });
    }
    return evaluatedPopulation;
}

function run_ga(numGens, genIndFunc, popSize, fitnessFunction) {
    if (numGens < 1) {
        throw Error("Number of generations must be at least 1.");
    }
    population = generatePopulation(genIndFunc, popSize);
    for (var i = 0; i < numGens; i++) {
        console.log("Generation " + (i + 1));
        var evaluatedPopulation = evaluatePopulation(population, fitnessFunction);
        evaluatedPopulation.sort(function(a, b) {
            return a.fitness - b.fitness;
        });
        x = randomTopPercent(evaluatedPopulation);
        y = randomTopPercent(evaluatedPopulation);
    }
}

function createRandomWordGenerator(wordLength) {
    return function generateRandomWord() {
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            word = "";
        for (var i = 0; i < wordLength; i++) {
            chara = randomIntFromInterval(0, alphabet.length);
            word += alphabet.charAt(chara);
        }
        return word
    }
}

var numGens = 10,
    popSize = 10,
    genIndFunc = createRandomWordGenerator(5), 
    fitnessFunction = createWordFitnessFunction("HELLO");

// run_ga(numGens, genIndFunc, popSize, fitnessFunction);


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

function GA(settings) {
    this.populationSize = settings.populationSize;
    this.fitnessFunction = settings.fitnessFunction;
    this.genIndFunc = settings.genIndFunc;
    this.numGens = settings.numGens;
    this.generation = 0;
    this.observers = settings.observers;
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
        this.generation++;
        this.fire('generationFinish');
        if (this.generation > 10) { // temp fix
            clearInterval(this.interval);
        }
    },
    fire: function(notification) {
        for (var i = 0; i < this.observers.length; i++) {
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
        this.interval = setInterval(jQuery.proxy(this, 'evolutionaryStep'));
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
            for (var i = 0; i < actualWord.length; i++) {
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
                console.log('Generation ' + ga.generation);
                break;
            case "generationFinish":
                console.log('Best: ' + ga.population[0]);
                console.log('Fitness: ' + ga.fitnessFunction(ga.population[0]));
                break;
        }
    }

    // var canvas = document.getElementById('timeSeries');
    // canvas.style.backgroundColor = "#ff0000";
    // canvas.style.border="1px solid #000000";

    var wordToFind = "HELLO WORLD";

    ga = new GA({
        selectionMethod: null,
        numGens: 100,
        populationSize: 500,
        genIndFunc: createRandomWordGenerator(wordToFind.length),
        fitnessFunction: createWordFitnessFunction(wordToFind),
        observers: [myObserver]
    });

    ga.run();

    // var timerId = setTimeout(function() { alert(1) }, 1000);
    // clearTimeout(timerId);

})();


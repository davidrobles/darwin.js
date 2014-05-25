


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
    var parentLength = parentA.length;
    var c = randomIntFromInterval(0, parentA.length);
    // console.log(c);
    var childA = parentA.substr(0, c) + parentB.substr(c, parentLength);
    var childB = parentB.substr(0, c) + parentA.substr(c, parentLength);
    return {
        childA: childA,
        childB: childB
    };
}

// console.log(reproduce("AAAAA", "BBBBB"));

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
    this.generations = [];
    this.observers = opts.observers;
}

GA.prototype = {
    evaluatePopulation: function() {
        return this.population.map(function(candidate) {
            return {
                candidate: candidate,
                fitness: this.fitnessFunction(candidate)
            };
        },
        this);
    },
    mutate: function(candidate) {
        var newString = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
        for (var i = 0; i < candidate.length; i++) {
            if (Math.random() < 0.01) {
                var chara = randomIntFromInterval(0, alphabet.length);
                console.log(chara);
                newString += alphabet.charAt(chara);
            } else {
                newString += candidate.charAt(i);
            }
        }
        return newString;
    },
    newPopulations: function() {
        var newPopulation = [];
        var halfLength = this.population.length / 2;
        for (var i = 0; i < halfLength; i++) {
            var parentA = randomTopPercent(this.evaluatedPopulation);
            var parentB = randomTopPercent(this.evaluatedPopulation);
            var children = reproduce(parentA.candidate, parentB.candidate); // remove .candidate
            var childA = this.mutate(children.childA);
            var childB = this.mutate(children.childB);
            newPopulation.push(childA);
            newPopulation.push(childB);
        }
        return newPopulation;
    },
    computeStats: function() {
        var totalFitness = this.evaluatedPopulation.map(function(candidate) {
                                              return candidate.fitness;
                                          })
                                          .reduce(function(prev, cur) {
                                              return prev + cur;
                                          });
        var average = totalFitness / this.evaluatedPopulation.length;

        this.generations.push({
            generation: this.generation,
            averageFitness: average,
            bestCandidate: ga.evaluatedPopulation[0].candidate,
            bestFitness: ga.evaluatedPopulation[0].fitness,
            population: this.evaluatedPopulation // sorted from best to worst?
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
        this.computeStats();
        this.fire('generationFinish');
        this.population = this.newPopulations();
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
        this.fire('startGA');
        this.population = generatePopulation(this.genIndFunc, this.populationSize);
        this.generation = 0;
        this.interval = setInterval(jQuery.proxy(this, 'evolutionaryStep'), 50);
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
            case "startGA":
                $(".generations").replaceWith(new GenerationsTableView(ga.generations).render().el);
                break;
            case "generationStart":
                break;
            case "generationFinish":
                var generationRowView = new GenerationRowView({
                    generation: ga.generations[ga.generation],
                    className: ga.generation % 2 == 0 ? "even" : "odd"
                });
                $(".generations").append(generationRowView.render().el);
                break;
        }
    }

    var wordToFind = "THIS IS A TEST ON GENETIC ALGORITHMS";

    ga = new GA({
        selectionMethod: null,
        numGens: 100,
        populationSize: 500,
        genIndFunc: createRandomWordGenerator(wordToFind.length),
        fitnessFunction: createWordFitnessFunction(wordToFind),
        observers: [myObserver]
    });

    ga.run();

})();


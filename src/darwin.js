var Darwin = Darwin || {};

(function() {
    "use strict";

    Darwin.GA = function(opts) {
        this.opts = opts || {};
        this.populationSize = opts.populationSize;
        this.fitnessFunction = opts.fitnessFunction;
        this.genIndFunc = opts.genIndFunc;
        this.generation = 1;
        // leave generations[0] unused for easier index acces, since first generation is 1, not 0
        this.generations = [undefined];
        this.observers = opts.observers;
        this.reproduce = opts.reproduce;
        this.mutate = opts.mutate;
        this.terminationConditions = opts.terminationConditions;
    }

    Darwin.GA.prototype = {

        newPopulations: function() {
            var newPopulation = [];
            var halfLength = this.population.length / 2; // verify population size % 2 == 0?
            for (var i = 0; i < halfLength; i++) {
                var parentA = Darwin.Selection.randomTopPercent(this.evaluatedPopulation);
                var parentB = Darwin.Selection.randomTopPercent(this.evaluatedPopulation);
                var children = this.reproduce(parentA.candidate, parentB.candidate); // remove .candidate
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
                bestCandidate: this.evaluatedPopulation[0].candidate,
                bestCandidateFitness: this.evaluatedPopulation[0].fitness,
                population: this.evaluatedPopulation // sorted from best to worst?
            });
        },

        evolutionaryStep: function() {
            // check if termination conditions are reached?
            this.fire('generationStart');
            this.evaluatedPopulation = Darwin.Utils.evaluatePopulation(this.population, this.fitnessFunction);
            this.fire('populationEvaluated');
            this.evaluatedPopulation.sort(function(a, b) {
                return b.fitness - a.fitness;
            });
            this.fire('populationSorted');
            this.computeStats();
            this.fire('generationFinish');
            this.population = this.newPopulations();
            if (Darwin.Utils.shouldContinue(this.generations[this.generation], this.terminationConditions)) {
                this.generation++;
            } else {
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
            this.population = Darwin.Utils.generatePopulation(this.genIndFunc, this.populationSize);
            this.interval = setInterval(jQuery.proxy(this, 'evolutionaryStep'), 50);
        }
    };
})();

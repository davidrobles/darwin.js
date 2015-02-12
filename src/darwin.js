var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.GA = function(options) {
        this.options = options || {};
        this.populationSize = options.populationSize; // TODO even population size?
        this.fitnessFunction = options.fitnessFunction;
        this.genIndFunc = options.genIndFunc;
        this.observers = options.observers;
        this.reproduce = options.reproduce;
        this.mutate = options.mutate;
        this.terminationConditions = options.terminationConditions;
        this.generations = [];
        this.currentGeneration = null;
    };

    Darwin.GA.prototype = {

        run: function() {
            this.trigger("ga-started");
            this.interval = setInterval(jQuery.proxy(this, "evolutionaryStep"), 50);
        },

        evolutionaryStep: function() {
            this.initGeneration();
            this.generatePopulation();
            this.evaluatePopulation();
            this.sortPopulation();
            this.computeStats();
            this.checkTermination();
        },

        initGeneration: function() {
            this.currentGeneration = {
                number: this.generations.length,
                status: "in-progress"
            };
            this.trigger("generation-started", this.currentGeneration);
        },

        generatePopulation: function() {
            // initial population
            if (this.currentGeneration.number === 0) {
                this.population = Darwin.Utils.generatePopulation(this.genIndFunc, this.populationSize);
            }
            // breed
            else {
                this.population = this.breed();
            }
            this.trigger("population-generated");
        },

        evaluatePopulation: function() {
            this.evaluatedPopulation = Darwin.Utils.evaluatePopulation(this.population, this.fitnessFunction);
            this.trigger("population-evaluated");
        },

        sortPopulation: function() {
            this.evaluatedPopulation.sort(function(a, b) {
                return b.fitness - a.fitness;
            });
            this.trigger("population-sorted");
        },

        computeStats: function() {
            var totalFitness = this.evaluatedPopulation.map(function(candidate) {
                return candidate.fitness;
            })
                .reduce(function(prev, cur) {
                    return prev + cur;
                });
            var average = totalFitness / this.evaluatedPopulation.length;

            // TODO extend object with _.extend
            this.currentGeneration.averageFitness = average;
            this.currentGeneration.bestCandidate = this.evaluatedPopulation[0].candidate;
            this.currentGeneration.bestCandidateFitness = this.evaluatedPopulation[0].fitness;
            this.currentGeneration.population = this.evaluatedPopulation; // sorted from best to worst?
            this.currentGeneration.status = "complete";
            this.generations.push(this.currentGeneration);
            this.trigger("stats");
        },

        checkTermination: function() {
            if (!Darwin.Utils.shouldContinue(this.generations[this.generations.length - 1], this.terminationConditions)) {
                this.trigger("ga-finished");
                clearInterval(this.interval);
            }
            this.trigger("generation-finished", this.currentGeneration);
        },

        breed: function() {
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

        reset: function() {
            this.population = [];
            this.evaluatedPopulation = [];
        }

    };

    _.extend(Darwin.GA.prototype, Backbone.Events);

})();

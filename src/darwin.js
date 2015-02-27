var Darwin = Darwin || {};

(function() {

    "use strict";

    /////////////////////////////////
    // Base Evolutionary Algorithm //
    /////////////////////////////////

    Darwin.EA = function(options) {
        this.populationSize = options.populationSize;
        this.fitnessFunction = options.fitnessFunction;
        this.individualFactory = options.individualFactory;
        this.reproduce = options.reproduce;
        this.mutate = options.mutate;
        this.terminationConditions = options.terminationConditions;
        this.generations = [];
        this.currentGeneration = null;
    };

    Darwin.EA.prototype = {

        evolutionaryStep: function() {
            this.initGeneration();
            this.generatePopulation();
            this.evaluatePopulation();
            this.sortPopulation();
            this.computeStats();
            this.endGeneration();
            this.checkTermination();
        },

        initGeneration: function() {
            this.currentGeneration = {
                id: this.generations.length,
                status: "in-progress"
            };
            this.trigger("generation-started", this.currentGeneration);
        },

        generatePopulation: function() {
            this.population = this.currentGeneration.id === 0 ?
                              Darwin.Utils.generatePopulation(this.individualFactory, this.populationSize) :
                              this.breed();
            this.trigger("population-generated", this.population);
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
            _.extend(this.currentGeneration, Darwin.Utils.generateStats(this.evaluatedPopulation));
            this.trigger("stats");
        },

        endGeneration: function() {
            this.currentGeneration.status = "complete";
            this.generations.push(this.currentGeneration);
            this.trigger("generation-finished", this.currentGeneration);
        },

        checkTermination: function() {
            if (!Darwin.Utils.shouldContinue(this.currentGeneration, this.terminationConditions)) {
                this.trigger("ea-finished");
                clearInterval(this.interval);
            }
        },

        breed: function() {
            var newPopulation = [];
            var halfLength = this.population.length / 2;
            for (var i = 0; i < halfLength; i++) {
                var parentA = Darwin.Selection.randomTopPercent(this.evaluatedPopulation);
                var parentB = Darwin.Selection.randomTopPercent(this.evaluatedPopulation);
                var children = this.reproduce(parentA.individual, parentB.individual); // remove .individual
                var childA = this.mutate(children.childA);
                var childB = this.mutate(children.childB);
                newPopulation.push(childA);
                newPopulation.push(childB);
            }
            return newPopulation;
        },

        // Controls

        start: function() {
            this.trigger("ea-started");
            this.interval = setInterval(jQuery.proxy(this, "evolutionaryStep"), 50);
        },

        reset: function() {
            clearInterval(this.interval);
            this.generations = [];
            this.currentGeneration = null;
            this.population = [];
            this.evaluatedPopulation = [];
            this.trigger("reset");
        }

    };

    _.extend(Darwin.EA.prototype, Backbone.Events);

    ////////////////////////
    // Evolution Strategy //
    ////////////////////////

    Darwin.ES = function(options) {
        Darwin.EA.call(this, options);
        this.parentsSize = options.parentsSize;    // μ
        this.childrenSize = options.childrenSize;  // λ
    };

    Darwin.ES.prototype = Object.create(Darwin.EA.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Darwin.ES,
            writable: true
        }
    });

    Darwin.ES.prototype.breed = function() {
        var newPopulation = [],
            parents = this.selectParents(),
            childrenPerParent = this.childrenSize / this.parentsSize;
        for (var i = 0; i < parents.length; i++) {
            for (var j = 0; j < childrenPerParent; j++) {
                var parent = parents[i].individual;
                var child = this.mutate(parent);
                newPopulation.push(child)
            }
        }
        return newPopulation;
    };

    Darwin.ES.prototype.selectParents = function() {
        return this.evaluatedPopulation.slice(0, this.parentsSize);
    };

})();

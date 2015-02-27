var Darwin = Darwin || {};

(function() {

    "use strict";

    /////////////////////////////////////
    // Abstract Evolutionary Algorithm //
    /////////////////////////////////////

    Darwin.EvolutionaryAlgorithm = function(options) {
        this.populationSize = options.populationSize;
        this.fitnessFunction = options.fitnessFunction;
        this.individualFactory = options.individualFactory;
        this.select = options.select;
        this.reproduce = options.reproduce;
        this.mutate = options.mutate;
        this.terminationConditions = options.terminationConditions;
        this.generations = [];
        this.currentGeneration = null;
    };

    Darwin.EvolutionaryAlgorithm.prototype = {

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
            this.population = this.currentGeneration.id === 0 ? this.generateInitialPopulation() : this.breed();
            this.trigger("population-generated", this.population);
        },

        evaluatePopulation: function() {
            var index = 0;
            this.evaluatedPopulation = _.map(this.population, function(individual) {
                return {
                    id: index++,
                    individual: individual,
                    fitness: this.fitnessFunction(individual)
                };
            }, this);
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

        generateInitialPopulation: function() {
            return _.map(_.range(this.populationSize), this.individualFactory);
        },

        breed: function() {
            throw "Not implemented method: breed()";
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

    _.extend(Darwin.EvolutionaryAlgorithm.prototype, Backbone.Events);

    ///////////////////////
    // Genetic Algorithm //
    ///////////////////////

    Darwin.GeneticAlgorithm = function(options) {
        Darwin.EvolutionaryAlgorithm.call(this, options);
    };

    Darwin.GeneticAlgorithm.prototype = Object.create(Darwin.EvolutionaryAlgorithm.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Darwin.GeneticAlgorithm,
            writable: true
        }
    });

    Darwin.GeneticAlgorithm.prototype.breed = function() {
        var newPopulation = [];
        var halfLength = this.population.length / 2;
        for (var i = 0; i < halfLength; i++) {
            var parentA = this.select(this.evaluatedPopulation);
            var parentB = this.select(this.evaluatedPopulation);
            var children = this.reproduce(parentA.individual, parentB.individual); // remove .individual
            var childA = this.mutate(children.childA);
            var childB = this.mutate(children.childB);
            newPopulation.push(childA);
            newPopulation.push(childB);
        }
        return newPopulation;
    };

    ////////////////////////
    // Evolution Strategy //
    ////////////////////////

    Darwin.EvolutionStrategy = function(options) {
        this.parentsSize = options.parentsSize;     // μ
        this.childrenSize = options.childrenSize;   // λ
        this.plusSelection = options.plusSelection; // if true (μ, λ), if false (μ + λ)
        this.childrenPerParent = this.childrenSize / this.parentsSize;
        options.populationSize = this.plusSelection ? (this.parentsSize + this.childrenSize) : this.childrenSize;
        Darwin.EvolutionaryAlgorithm.call(this, options);
    };

    Darwin.EvolutionStrategy.prototype = Object.create(Darwin.EvolutionaryAlgorithm.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Darwin.EvolutionStrategy,
            writable: true
        }
    });

    Darwin.EvolutionStrategy.prototype.breed = function() {
        var newPopulation = [],
            parents = this.selectParents();
        if (this.plusSelection) {
            newPopulation = _.map(parents, function(parent) {
                return parent.individual;
            });
        }
        _.each(parents, function(parent) {
            for (var i = 0; i < this.childrenPerParent; i++) {
                var child = this.mutate(parent.individual); // TODO change .individual to genotype? or phenotype?
                newPopulation.push(child)
            }
        }, this);
        return newPopulation;
    };

    Darwin.EvolutionStrategy.prototype.selectParents = function() {
        return this.evaluatedPopulation.slice(0, this.parentsSize);
    };

})();
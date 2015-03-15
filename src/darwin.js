var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    /////////////////////////////////////
    // Abstract Evolutionary Algorithm //
    /////////////////////////////////////

    Darwin.EvolutionaryAlgorithm = function(options) {
        this.populationSize = options.populationSize;
        this.fitnessFunction = options.fitnessFunction;
        this.individualFactory = options.individualFactory;
        this.select = options.selection;
        this.recombine = options.recombination;
        this.recombinationRate = options.recombinationRate;
        this.mutate = options.mutation;
        this.mutationRate = options.mutationRate;
        this.terminationConditions = options.terminationConditions;
        this.generations = [];
        this.population = [];
        this.currentGeneration = null;
    };

    Darwin.EvolutionaryAlgorithm.prototype = {

        evolutionaryStep: function() {
            this.initGeneration();
            this.generatePopulation();
            this.evaluatePopulation();
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
            this.population = this.currentGeneration.id === 0 ? this.initializePopulation() : this.breed();
            this.trigger("population-generated", this.population);
        },

        evaluatePopulation: function() {
            _.each(this.population, function(individual) {
                individual.fitness = this.fitnessFunction(individual);
            }, this);
            this.trigger("population-evaluated");
        },

        computeStats: function() {
            _.extend(this.currentGeneration, this.generateStats());
            this.trigger("stats");
        },

        endGeneration: function() {
            this.currentGeneration.status = "complete";
            this.generations.push(this.currentGeneration);
            this.trigger("generation-finished", this.currentGeneration);
        },

        checkTermination: function() {
            if (this.shouldTerminate()) {
                this.trigger("ea-finished");
                clearInterval(this.interval);
            }
        },

        shouldTerminate: function() {
            return _.some(this.terminationConditions, function(condition) {
                return condition(this.currentGeneration);
            }, this);
        },

        initializePopulation: function() {
            return _.map(_.range(this.populationSize), function(individualId) {
                return {
                    id: individualId,
                    generation: this.currentGeneration,
                    genotype: this.individualFactory()
                };
            }, this);
        },

        // TODO assumes the best fitness is a high value (not always true!)
        // TODO what if more than one individual have the best fitness?
        generateStats: function() {
            var population = this.population
            var totalFitness = 0,
                bestIndividual = null,
                worstIndividual = null;
            _.each(population, function(individual) {
                totalFitness += individual.fitness;
                if (!bestIndividual || individual.fitness > bestIndividual.fitness) {
                    bestIndividual = individual;
                }
                if (!worstIndividual || individual.fitness < worstIndividual.fitness) {
                    worstIndividual = individual;
                }
            });
            var average = totalFitness / population.length;
            var diff = _.reduce(population, function(memo, individual) {
                return memo + Math.pow(individual.fitness - average, 2)
            }, 0);
            var variance = diff / population.length;
            var std = Math.sqrt(variance);
            return {
                fitnessAvg: average,
                fitnessStd: std,
                bestIndividual: bestIndividual,
                worstIndividual: worstIndividual,
                population: population
            };
        },

        // Abstract methods

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
            this.population = [];
            this.currentGeneration = null;
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
        var newPopulation = [],
            halfLength = this.population.length / 2;
        for (var i = 0; i < halfLength; i++) {
            // Select parents
            var parentA = this.select(this.population);
            var parentB = this.select(this.population);
            var childA = parentA;
            var childB = parentB;
            // Recombination
            if (Math.random() < this.recombinationRate) {
                var children = this.recombine(parentA, parentB);
                childA = children.childA;
                childB = children.childB;
            }
            // Mutation
            childA = this.mutate(childA, this.mutationRate);
            childB = this.mutate(childB, this.mutationRate);
            // Add to new population
            newPopulation.push({
                id: i * 2,
                generation: this.currentGeneration,
                genotype: childA
            });
            newPopulation.push({
                id: i * 2 + 1,
                generation: this.currentGeneration,
                genotype: childB
            });
        }
        return newPopulation;
    };

    Darwin.GeneticAlgorithm.prototype.toString = function() {
        return "Genetic Algorithm";
    };

    ////////////////////////
    // Evolution Strategy //
    ////////////////////////

    Darwin.EvolutionStrategy = function(options) {
        this.parentsSize = options.parentsSize;     // μ
        this.childrenSize = options.childrenSize;   // λ
        this.plusSelection = options.plusSelection; // if true (μ + λ), if false (μ, λ)
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

    // TODO pass the parents? and the selection type? operators? variables
    Darwin.EvolutionStrategy.prototype.breed = function() {
        var newPopulation = [],
            parents = this.selectParents(),
            individualId = 0;
        if (this.plusSelection) {
            newPopulation = _.map(parents, function(parent) {
                return {
                    id: individualId++,
                    generation: this.currentGeneration,
                    genotype: parent.genotype
                };
            }, this);
        }
        _.each(parents, function(parent) {
            for (var i = 0; i < this.childrenPerParent; i++) {
                var childGenotype = this.mutate(parent.genotype, this.mutationRate);
                newPopulation.push({
                    id: individualId++,
                    generation: this.currentGeneration,
                    genotype: childGenotype
                })
            }
        }, this);
        return newPopulation;
    };

    Darwin.EvolutionStrategy.prototype.selectParents = function() {
        var population = _.clone(this.population);
        population.sort(function(a, b) {
            return b.fitness - a.fitness;
        });
        return _.map(population.slice(0, this.parentsSize), function(individual) {
            return individual;
        });
    };

    Darwin.EvolutionStrategy.prototype.toString = function() {
        return "Evolution Strategy";
    };

})(Darwin);
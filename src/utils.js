var Darwin = Darwin || {};

(function() {

    "use strict"

    Darwin.Utils = {

        evaluatePopulation: function(population, fitnessFunction) {
            var index = 0; // TODO hacky, fix it
            return _.map(population, function(candidate) {
                return {
                    id: index++,
                    candidate: candidate,
                    fitness: fitnessFunction(candidate)
                };
            });
        },

        generatePopulation: function(candidateFactory, popSize) {
            return _.map(_.range(popSize), function() {
                return candidateFactory();
            });
        },

        shouldContinue: function(popData, conditions) {
            return _.every(conditions, function(condition) {
                return !condition.shouldTerminate(popData);
            });
        },

        shouldTerminate: function(popData, conditions) {
            return _.some(conditions, function(condition) {
                return condition.shouldTerminate(popData);
            });
        }

    };

    Darwin.Utils.Callbacks = function() {
        this.list = [];
    };

    Darwin.Utils.Callbacks.prototype = {
        add: function(callback) {
            this.list = this.list || [];
            this.list.push(callback);
        },
        empty: function() {
        },
        remove: function() {
        },
        fire: function() {
            this.list.forEach(function(callback) {
                callback();
            });
        }
    };

})();

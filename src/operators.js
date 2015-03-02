var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Operators = {

        ///////////////////
        // Recombination //
        ///////////////////


        // One point random crossover for two String candidates.
        // Assumes that both candidate Strings are the same length.
        singlePointCrossover: function(parentA, parentB) {
            var parentLength = parentA.length;
            var crossoverPoint = _.random(0, parentLength);
            return {
                childA: parentA.substr(0, crossoverPoint)
                        + parentB.substr(crossoverPoint, parentLength),
                childB: parentB.substr(0, crossoverPoint)
                        + parentA.substr(crossoverPoint, parentLength)
            };
        },

        //////////////
        // Mutation //
        //////////////

        // Creates a mutation operator function that is applied with the given
        // probability and draws its characters from the specified alphabet.
        createStringMutation: function(alphabet) {
            return function(individual, mutationRate) {
                var newString = "";
                for (var i = 0; i < individual.length; i++) {
                    if (Math.random() < mutationRate) {
                        var randChar = _.random(0, alphabet.length - 1);
                        newString += alphabet.charAt(randChar);
                    } else {
                        newString += individual.charAt(i);
                    }
                }
                return newString;
            };
        }
    }

})();

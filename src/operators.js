var Darwin = Darwin || {};

(function() {

    "use strict";

    Darwin.Operators = {
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
        twoPointCrossover: function(parentA, parentB) {

        },
        cutAndSplice: function(parentA, parentB) {
        }
    };

})();

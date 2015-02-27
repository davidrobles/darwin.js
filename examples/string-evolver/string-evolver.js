var StringEvolver = {

    createWordFitnessFunction: function(targetWord) {
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
    },

    createRandomStringGenerator: function(alphabet, stringLength) {
        return function generateRandomString() {
            var str = "";
            for (var i = 0; i < stringLength; i++) {
                var randChar = _.random(0, alphabet.length - 1);
                str += alphabet.charAt(randChar);
            }
            return str
        }
    },

    createRandomCharacterMutation: function(alphabet, mutationRate) {
        return function(individual) {
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
    },

    createStringDiffView: function(target) {
        return Backbone.View.extend({
            tagName: "p",
            initialize: function(options) {
                this.actual = options.actual;
                this.target = target;
            },
            render: function() {
                for (var i = 0; i < this.target.length; i++) {
                    var type = this.target.charAt(i) === this.actual.charAt(i) ? "match" : "mismatch";
                    this.$el.append('<span class="' + type + '">' + this.actual.charAt(i) + '</span>');
                }
                return this;
            }
        });
    }

};

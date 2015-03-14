"use strict";

var StringEvolver = {

    createWordFitnessFunction: function(targetWord) {
        return function(individual) {
            var total = 0,
                actualWord = individual.genotype,
                actualWordLength = actualWord.length;
            for (var i = 0; i < actualWordLength; i++) {
                if (actualWord.charAt(i) === targetWord.charAt(i)) {
                    total++;
                }
            }
            return total;
        }
    },

    // generates random strings of a fixed length from a given alphabet
    createStringFactory: function(alphabet, stringLength) {
        return function() {
            var str = "";
            for (var i = 0; i < stringLength; i++) {
                var randChar = _.random(0, alphabet.length - 1);
                str += alphabet.charAt(randChar);
            }
            return str
        }
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
                    this.$el.append('<span class="fixed-str ' + type + '">' + this.actual.charAt(i) + '</span>');
                }
                return this;
            }
        });
    }

};

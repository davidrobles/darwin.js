var Evolver = {};
Evolver.GenerationsCollection = Backbone.Collection.extend();
Evolver.generationsCollection = new Evolver.GenerationsCollection();

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

    createRandomStringGenerator: function(charPool, wordLength) {
        return function generateRandomString() {
            var str = "";
            for (var i = 0; i < wordLength; i++) {
                var randChar = _.random(0, charPool.length - 1);
                str += charPool.charAt(randChar);
            }
            return str
        }
    },

    myObserver: function(ga, notification) {
        switch (notification) {
            case "ga-started":
                window.generationsTableView = new GenerationsTableView({
                    collection: Evolver.generationsCollection
                });
                $(".generations").replaceWith(generationsTableView.el);
                break;
            case "generation-started":
                //var curGA = ga.currentGeneration;
                window.generationsTableView.addNewGeneration();
                break;
            case "generation-finished":
                // var gen = ga.generations[ga.generations.length - 1]; // TODO create function to return current generation
                var gen = ga.currentGeneration;
                Evolver.generationsCollection.add(gen);
                // add details
                if (!window.detailsView) {
                    window.detailsView = new GenerationDetailsView(gen);
                }
                window.detailsView.generation = gen;
                $(".generationDetails").replaceWith(window.detailsView.render().el);
                break;
            case "ga-finished":
                break;
        }
    },

    randomCharacterMutation: function(candidate) {
        var newString = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // fix this
        for (var i = 0; i < candidate.length; i++) {
            if (Math.random() < 0.01) {
                var randChar = _.random(0, alphabet.length - 1);
                newString += alphabet.charAt(randChar);
            } else {
                newString += candidate.charAt(i);
            }
        }
        return newString;
    }

};

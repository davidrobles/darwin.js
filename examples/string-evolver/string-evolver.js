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

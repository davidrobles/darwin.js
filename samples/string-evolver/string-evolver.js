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
                chara = Darwin.Utils.randomIntFromInterval(0, charPool.length - 1);
                str += charPool.charAt(chara);
            }
            return str
        }
    },

    myObserver: function(ga, notification) {
        switch (notification) {
            case "startGA":
                window.generationsTableView = new GenerationsTableView({
                    generations: ga.generations,
                    numRows: 80
                });
                $(".generations").replaceWith(generationsTableView.el);
                break;
            case "generationStart":
                break;
            case "generationFinish":
                window.generationsTableView.render();
                break;
        }
    },

    randomCharacterMutation: function(candidate) {
        var newString = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // fix this
        for (var i = 0; i < candidate.length; i++) {
            if (Math.random() < 0.01) {
                var chara = Darwin.Utils.randomIntFromInterval(0, alphabet.length - 1);
                newString += alphabet.charAt(chara);
            } else {
                newString += candidate.charAt(i);
            }
        }
        return newString;
    }

};

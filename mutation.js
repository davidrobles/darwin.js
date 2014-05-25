//////////////////////
// Mutation methods //
//////////////////////

function randomCharacterMutation(candidate) {
    var newString = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // fix this
    for (var i = 0; i < candidate.length; i++) {
        if (Math.random() < 0.01) {
            var chara = randomIntFromInterval(0, alphabet.length);
            newString += alphabet.charAt(chara);
        } else {
            newString += candidate.charAt(i);
        }
    }
    return newString;
}

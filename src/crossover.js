Darwin.Operators = {
	singlePointCrossover: function(parentA, parentB) {
		// verify certain initial condition
		var parentLength = parentA.length;
		var crossoverPoint = Darwin.Utils.randomIntFromInterval(0, parentLength);
		var childA = parentA.substr(0, crossoverPoint) + parentB.substr(crossoverPoint, parentLength);
		var childB = parentB.substr(0, crossoverPoint) + parentA.substr(crossoverPoint, parentLength);
		return {
			childA: childA,
			childB: childB
		};
	},
	twoPointCrossover: function(parentA, parentB) {

	},
	cutAndSplice: function(parentA, parentB) {
	},
	randomCharacterMutation: function(candidate) {
		var newString = "";
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // fix this
		for (var i = 0; i < candidate.length; i++) {
			if (Math.random() < 0.01) {
				var chara = Darwin.Utils.randomIntFromInterval(0, alphabet.length);
				newString += alphabet.charAt(chara);
			} else {
				newString += candidate.charAt(i);
			}
		}
		return newString;
	}
};

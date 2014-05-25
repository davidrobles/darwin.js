///////////////////////
// Selection methods //
///////////////////////

function randomTopPercent(evaluatedPopulation) {
    var randIndex = randomIntFromInterval(0, (evaluatedPopulation.length / 2) -1);
    return evaluatedPopulation[randIndex];
}

// Also known as fitness proportionate selection
function routletteWheelSelection(evalPop) {
}

function tournamentSelection(evalPop) {
}

function rankSelection(evalPop) {
}

function boltzmannSelection(evalPop) {
}

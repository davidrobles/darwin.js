///////////////////////
// Selection methods //
///////////////////////

function randomTopPercent(evaluatedPopulation) {
    var randIndex = randomIntFromInterval(0, (evaluatedPopulation.length / 2) -1);
    return evaluatedPopulation[randIndex];
}

///////////////////////
// Crossover methods //
///////////////////////

function singlePointCrossover(parentA, parentB) {
    // verify certain initial condition
    var parentLength = parentA.length;
    var crossoverPoint = randomIntFromInterval(0, parentLength);
    var childA = parentA.substr(0, crossoverPoint) + parentB.substr(crossoverPoint, parentLength);
    var childB = parentB.substr(0, crossoverPoint) + parentA.substr(crossoverPoint, parentLength);
    return {
        childA: childA,
        childB: childB
    };
}

function twoPointCrossover(parentA, parentB) {

}

function cutAndSplice(parentA, parentB) {
}

darwin.js
=========

A JavaScript framework for Evolutionary Algorithms.

This framework is work in progress. The goal is to provide a general framework for the following type of
evolutionary algorithms:

- Genetic Algorithms
- Genetic Programming
- Evolution Strategies - Support for both (μ + λ) and (μ, λ) evolution strategies.

## Recombination

- One Point Crossover
- N-Point Crossover
- Uniform Crossover

## Selection

- Fitness Proportional Selection
- Ranking Selection
- Tournament Selection

## Callbacks

| Callback                   | Description
| -------------------------- | -----------
| ea-started                 | Fires once, when the EA starts
| generation-started         | Fires when a new generation starts
| population-generated       | Fires when the population generated on every generation
| population-evaluated       | Fires when the population is evaluated at the beginning of a generation
| generation-finished        | Fires when a new generation ends
| ea-finished                | Fires once, when the EA ends
| reset                      | Fires when the EA is reset

## Examples

### Genetic Algorithm - String Evolver

```javascript
var charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ",
    mutationRate = 0.10,
    wordToFind = "HELLO WORLD",
    stringEvolver = new Darwin.GA({
        populationSize: 100,
        individualFactory: StringEvolver.createRandomStringGenerator(charPool, wordToFind.length),
        fitnessFunction: StringEvolver.createWordFitnessFunction(wordToFind),
        select: Darwin.Selection.randomTopPercent,
        reproduce: Darwin.Operators.singlePointCrossover,
        mutate: StringEvolver.createRandomCharacterMutation(charPool, mutationRate),
        terminationConditions: [new Darwin.Termination.TargetFitness(wordToFind.length)]
    });
    stringEvolver.run()
```

### Evolution Strategy - String Evolver

```javascript
var wordToFind = "HELLO WORLD",
    charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ",
    mutationRate = 0.10,
    stringEvolver = new Darwin.ES({
        parentsSize: 10,
        childrenSize: 40,
        plusSelection: true,
        individualFactory: StringEvolver.createRandomStringGenerator(charPool, wordToFind.length),
        fitnessFunction: StringEvolver.createWordFitnessFunction(wordToFind),
        mutate: StringEvolver.createRandomCharacterMutation(charPool, mutationRate),
        terminationConditions: [new Darwin.Termination.TargetFitness(wordToFind.length)]
    }),
    stringEvolver.run()
```

## Dashboard

[String Evolver](https://rawgit.com/davidrobles/darwin.js/master/examples/string-evolver/index.html)

![Monte Carlo PI Demo](examples/string-evolver/string-evolver.png "Monte Carlo PI Demo")

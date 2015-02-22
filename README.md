darwin.js
=========

A JavaScript framework for Evolutionary Algorithms.

Example
=======

[String Evolver](https://rawgit.com/davidrobles/darwin.js/master/examples/string-evolver/index.html)

Callbacks
=========

| Callback                   | Description
| -------------------------- | -----------
| ea-started                 | Fires once, when the EA starts
| generation-started         | Fires when a new generation starts
| population-generated       | Fires when the population generated on every generation
| population-evaluated       | Fires when the population is evaluated at the beginning of a generation
| generation-finished        | Fires when a new generation ends
| ea-finished                | Fires once, when the EA ends
| reset                      | Fires when the EA is reset
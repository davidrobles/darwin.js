var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.vent = _.extend({}, Backbone.Events);

    Darwin.Views = {};
    Darwin.Models = {};

    Darwin.Models.GeneticAlgorithmConfiguration = Backbone.Model.extend({

        POPULATION_SIZE: 100,

        RECOMBINATION_RATE: 0.50,

        MUTATION_RATE: 0.02,

        initialize: function(options) {
            options = options || {};
            // Required
            if (typeof options.recombination !== "undefined") {
                this.set("recombination", options.recombination);
            }
            if (typeof options.mutation !== "undefined") {
                this.set("mutation", options.mutation);
            }
            if (typeof options.individualFactory !== "undefined") {
                this.set("individualFactory", options.individualFactory);
            }
            if (typeof options.terminationConditions !== "undefined") {
                this.set("terminationConditions", options.terminationConditions);
            }
            if (typeof options.fitnessFunction !== "undefined") {
                this.set("fitnessFunction", options.fitnessFunction);
            }
            if (typeof options.selection !== "undefined") {
                this.set("selection", options.selection);
            }
            // Optional
            this.set(
                "populationSize",
                (typeof options.populationSize !== "undefined") ? options.populationSize : this.POPULATION_SIZE
            );
            this.set(
                "recombinationRate",
                (typeof options.recombinationRate !== "undefined") ? options.recombinationRate : this.RECOMBINATION_RATE
            );
            this.set(
                "mutationRate",
                (typeof options.mutationRate !== "undefined") ? options.mutationRate : this.MUTATION_RATE);
        },

        validate: function(attrs) {
            var errors = [];
            if (typeof attrs.populationSize === "undefined") {
                errors.push("Missing population size.");
            } else if (attrs.populationSize < 1) {
                errors.push("Population size must be greater than 0");
            }
            if (attrs.populationSize % 2 !== 0) {
                errors.push("Population size must be a multiple of 2");
            }
            if (typeof attrs.selection === "undefined" || !_.isFunction(attrs.selection)) {
                errors.push("Missing selection function");
            }
            if (typeof attrs.mutation === "undefined" || !_.isFunction(attrs.mutation)) {
                errors.push("Missing mutation function");
            }
            if (typeof attrs.mutationRate === "undefined") {
                errors.push("Missing mutation rate");
            } else if (!_.isNumber(attrs.mutationRate) || attrs.mutationRate < 0.0 || attrs.mutationRate > 1.0) {
                errors.push("Mutation rate must be a number between 0.0 and 1.0");
            }
            if (typeof attrs.recombination === "undefined" || !_.isFunction(attrs.recombination)) {
                errors.push("Missing recombination function");
            }
            if (typeof attrs.recombinationRate === "undefined") {
                errors.push("Missing recombination rate");
            } else if (!_.isNumber(attrs.recombinationRate) || attrs.recombinationRate < 0.0 || attrs.recombinationRate > 1.0) {
                errors.push("Recombination rate must be a number between 0.0 and 1.0");
            }
            if (typeof attrs.individualFactory === "undefined" || !_.isFunction(attrs.individualFactory)) {
                errors.push("Missing individual factory function");
            }
            if (typeof attrs.terminationConditions === "undefined") {
                errors.push("Missing termination conditions");
            }
            if (typeof attrs.fitnessFunction === "undefined" || !_.isFunction(attrs.fitnessFunction)) {
                errors.push("Missing fitness function");
            }
            if (!_.isEmpty(errors)) {
                return errors;
            }
        }

    });

    Darwin.Models.EvolutionStrategyConfiguration = Backbone.Model.extend({

        PARENTS_SIZE: 10,

        CHILDREN_SIZE: 70,

        MUTATION_RATE: 0.05,

        PLUS_SELECTION: false,

        initialize: function(options) {
            options = options || {};
            // Required
            if (typeof options.mutation !== "undefined") {
                this.set("mutation", options.mutation);
            }
            if (typeof options.individualFactory !== "undefined") {
                this.set("individualFactory", options.individualFactory);
            }
            if (typeof options.terminationConditions !== "undefined") {
                this.set("terminationConditions", options.terminationConditions);
            }
            if (typeof options.fitnessFunction !== "undefined") {
                this.set("fitnessFunction", options.fitnessFunction);
            }
            // Optional
            this.set(
                "parentsSize",
                (typeof options.parentsSize !== "undefined") ? options.parentsSize : this.PARENTS_SIZE
            );
            this.set(
                "childrenSize",
                (typeof options.childrenSize !== "undefined") ? options.childrenSize : this.CHILDREN_SIZE
            );
            this.set(
                "mutationRate",
                (typeof options.mutationRate !== "undefined") ? options.mutationRate : this.MUTATION_RATE
            );
            this.set(
                "plusSelection",
                (typeof options.plusSelection !== "undefined") ? options.plusSelection : this.PLUS_SELECTION
            );
        },

        validate: function(attrs) {
            var errors = [];
            if (typeof attrs.parentsSize === "undefined") {
                errors.push("Missing parents size.");
            } else if (attrs.parentsSize < 1) {
                errors.push("μ (parents size) must be greater than 0");
            }
            if (typeof attrs.childrenSize === "undefined") {
                errors.push("Missing children size");
            } else if (attrs.childrenSize < 1) {
                errors.push("λ (children size) must be greater than 0");
            }
            if (attrs.childrenSize % attrs.parentsSize !== 0) {
                errors.push("λ (children size) must be a multiple of μ (parents size)");
            }
            if (typeof attrs.plusSelection === "undefined") {
                errors.push("Missing plus selection value");
            } else if (!_.isBoolean(attrs.plusSelection)) {
                errors.push("Plus selection must be a boolean.");
            }
            if (typeof attrs.mutation === "undefined" || !_.isFunction(attrs.mutation)) {
                errors.push("Missing mutation function");
            }
            if (typeof attrs.mutationRate === "undefined") {
                errors.push("Missing mutation rate");
            } else if (!_.isNumber(attrs.mutationRate) || attrs.mutationRate < 0.0 || attrs.mutationRate > 1.0) {
                errors.push("Mutation rate must be a number between 0.0 and 1.0");
            }
            if (typeof attrs.individualFactory === "undefined" || !_.isFunction(attrs.individualFactory)) {
                errors.push("Missing individual factory function");
            }
            if (typeof attrs.terminationConditions === "undefined") {
                errors.push("Missing termination conditions");
            }
            if (typeof attrs.fitnessFunction === "undefined" || !_.isFunction(attrs.fitnessFunction)) {
                errors.push("Missing fitness function");
            }
            if (!_.isEmpty(errors)) {
                return errors;
            }
        }

    });

    /////////////////////////
    // Configuration Views //
    /////////////////////////

    Darwin.Views.GeneticAlgorithmConfigurationView = Backbone.View.extend({

        template: _.template(Darwin.Templates.geneticAlgorithmConfigurationView),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        start: function() {
            var populationSize = parseInt(this.$("input[name=population-size]").val());
            this.model.set("populationSize", populationSize);
            var recombinationRate = parseFloat(this.$("input[name=recombination-rate]").val()) * .01;
            this.model.set("recombinationRate", recombinationRate);
            var mutationRate = parseFloat(this.$("input[name=mutation-rate]").val()) * .01;
            this.model.set("mutationRate", mutationRate);
            if (!this.model.isValid()) {
                throw this.model.validationError.join("\n");
            }
            var geneticAlgorithm = new Darwin.GeneticAlgorithm(this.model.attributes);
            Darwin.vent.trigger("start-ea", geneticAlgorithm);
        }

    });

    Darwin.Views.EvolutionStrategyConfigurationView = Backbone.View.extend({

        template: _.template(Darwin.Templates.evolutionaryStrategyConfigurationView),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        start: function() {
            var parentsSize = parseInt(this.$("input[name=parents-size]").val());
            this.model.set("parentsSize", parentsSize);
            var childrenSize = parseInt(this.$("input[name=children-size]").val());
            this.model.set("childrenSize", childrenSize);
            var plusSelection = this.$("select[name=plus-selection]").val() === "true";
            this.model.set("plusSelection", plusSelection);
            var mutationRate = parseFloat(this.$("input[name=mutation-rate]").val()) * .01;
            this.model.set("mutationRate", mutationRate);
            if (!this.model.isValid()) {
                throw this.model.validationError.join("\n");
            }
            var evolutionStrategy = new Darwin.EvolutionStrategy(this.model.attributes);
            Darwin.vent.trigger("start-ea", evolutionStrategy);
        }

    });

    Darwin.Views.EAConfigurationView = Backbone.View.extend({

        className: "widget widget-info",

        template: _.template(Darwin.Templates.evolutionaryAlgorithmConfigurationView),

        subviews: {
            "GA": Darwin.Views.GeneticAlgorithmConfigurationView,
            "ES": Darwin.Views.EvolutionStrategyConfigurationView
        },

        configuration: {
            "GA": Darwin.Models.GeneticAlgorithmConfiguration,
            "ES": Darwin.Models.EvolutionStrategyConfiguration
        },

        events: {
            "click .start": "start",
            "click .reset": "reset",
            "change .ea-type": "changeConfigurationTypeEvent"
        },

        initialize: function(options) {
            this.configOptions = options;
        },

        changeConfigurationTypeEvent: function(event) {
            var configType = event.target.value;
            this.changeConfigurationType(configType)
        },

        changeConfigurationType: function(configType) {
            this.ConfigurationModel = this.configuration[configType];
            this.ConfigurationView = this.subviews[configType];
            this.renderSubview();
        },

        render: function() {
            this.$el.html(this.template());
            this.changeConfigurationType("GA");
            return this;
        },

        renderSubview: function() {
            var eaConfig = new this.ConfigurationModel(_.clone(this.configOptions));
            if (!eaConfig.isValid()) {
                console.log(eaConfig.validationError);
            }
            this.subview = new this.ConfigurationView({
                model: eaConfig
            });
            this.$(".ea-type-view").html(this.subview.render().el);
        },

        start: function() {
            this.subview.start();
            this.$(".start").prop("disabled", true);
            this.$(".reset").prop("disabled", false);
        },

        reset: function() {
            this.$(".population-size").prop("disabled", false);
            this.$(".start").prop("disabled", false);
            this.$(".reset").prop("disabled", true);
            Darwin.vent.trigger("reset-ea");
        }

    });

    ///////////////
    // Dashboard //
    ///////////////

    Darwin.Views.DashboardView = Backbone.View.extend({

        template: _.template(Darwin.Templates.dashboardLayout),

        className: "dashboard",

        initialize: function(options) {
            this.options = options;
            this.PhenotypeView = options.phenotypeView;
            this.initSubviews();
            this.listenTo(Darwin.vent, "start-ea", this.startEA);
        },

        initSubviews: function() {
            this.generationsCollection = new Backbone.Collection();
            this.generationsTableView = new Darwin.Views.GenerationsTableView({
                collection: this.generationsCollection,
                phenotypeView: this.PhenotypeView
            });
            this.populationTableView = new Darwin.Views.PopulationTableView({
                phenotypeView: this.PhenotypeView
            });
            this.individualDetailsView = new Darwin.Views.IndividualDetailsView({
                phenotypeView: this.PhenotypeView
            });
            this.configurationView = new Darwin.Views.EAConfigurationView(_.clone(this.options));
            this.graph = new Darwin.Views.GenerationsFitnessGraphView({
                maxGenerations: this.options.maxGenerations,
                maxFitness: this.options.maxFitness
            });
        },

        startEA: function(ea) {
            var gensMap = {};

            this.listenTo(ea, "reset", function() {
                this.generationsTableView.remove();
                this.populationTableView.remove();
                this.individualDetailsView.remove();
                this.initSubviews();
                this.render();
            });

            this.listenTo(Darwin.vent, "reset-ea", function() {
                ea.reset();
            });

            this.listenTo(ea, "generation-started", function(generation) {
                this.generationsCollection.add(generation);
                var last = this.generationsCollection.last();
                gensMap[last.get("id")] = last;
            });

            this.listenTo(ea, "generation-finished", function(generation) {
                var generationModel = gensMap[generation.id];
                generationModel.set(generation);
                this.populationTableView.generationSelected(generationModel);
                this.graph.addPoints({
                    best: {
                        id: generation.id,
                        fitness: generation.bestIndividual.fitness
                    },
                    avg: {
                        id: generation.id,
                        fitness: generation.fitnessAvg
                    },
                    worst: {
                        id: generation.id,
                        fitness: generation.worstIndividual.fitness
                    },
                    stdUp: {
                        id: generation.id,
                        fitness: generation.fitnessAvg + generation.fitnessStd
                    },
                    stdDown: {
                        id: generation.id,
                        fitness: generation.fitnessAvg - generation.fitnessStd
                    }
                });
            });
            ea.start();
        },

        render: function() {
            this.$el.html(this.template());
            this.$(".dashboard-sidebar").append(this.configurationView.render().el);
            this.$(".dashboard-content").append(this.generationsTableView.render().el);
            this.$(".dashboard-content").append(this.populationTableView.render().el);
            this.$(".dashboard-content").append(this.individualDetailsView.render().el);
            this.$(".dashboard-content").append(this.graph.el);
            return this;
        }

    });

    Darwin.Views.GenerationsTableView = Backbone.View.extend({

        tagName: "table",

        className: "ea generations widget",

        template: _.template(Darwin.Templates.generationsTableView),

        initialize: function(options) {
            options = options || {};
            this.PhenotypeView = options.phenotypeView;
            this.selectedGenerationRowView = null;
            this.generationRowViews = [];
            this.listenTo(Darwin.vent, "generation-selected", this.selectGeneration);
            if (this.collection) {
                this.listenTo(this.collection, "add", this.addGeneration);
            }
        },

        addGeneration: function(generation) {
            this.generationRowView = new Darwin.Views.GenerationRowView({
                model: generation,
                phenotypeView: this.PhenotypeView
            });
            this.generationRowViews.push(this.generationRowView);
            this.$("tbody").append(this.generationRowView.render().el);
            this.selectGeneration(generation);
            this.$("tbody").scrollTop(100000);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        selectGeneration: function(generation) {
            if (this.selectedGenerationRowView) {
                if (this.selectedGenerationRowView.model.get("id") === generation.get("id")) {
                    return;
                }
                this.selectedGenerationRowView.unselect();
            }
            this.selectedGenerationRowView = this.generationRowViews[generation.get("id")];
            this.selectedGenerationRowView.select();
        }

    });

    Darwin.Views.SelectableRowView = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click": "customSelect"
        },

        select: function() {
            this.$el.addClass("selected");
        },

        unselect: function() {
            this.$el.removeClass("selected");
        }

    });

    Darwin.Views.GenerationRowView = Darwin.Views.SelectableRowView.extend({

        templates: {
            "complete": _.template(Darwin.Templates.generationRowView),
            "in-progress": _.template(Darwin.Templates.generationRowViewInProgress)
        },

        initialize: function(options) {
            this.phenotypeView = options.phenotypeView;
            this.listenTo(this.model, "change", this.render);
        },

        // TODO Refactor
        render: function() {
            var templateName = this.model.get("status");
            if (templateName === "complete") {
                this.$el.html(this.templates[templateName]({
                    id: this.model.get("id"),
                    bestIndividualFitness: this.model.get("bestIndividual").fitness,
                    fitnessAvg: this.model.get("fitnessAvg") // TODO rename to avgFitness
                }));
                this.$(".phenotype").append(new this.phenotypeView({
                    actual: this.model.get("bestIndividual").genotype
                }).render().el);
            } else {
                this.$el.html(this.templates[templateName](this.model.toJSON()));
            }
            return this;
        },

        customSelect: function() {
            Darwin.vent.trigger("generation-selected", this.model);
        }

    });

    Darwin.Views.PopulationTableView = Backbone.View.extend({

        tagName: "table",

        className: "ea population widget",

        template: _.template(Darwin.Templates.populationTableView),

        initialize: function(options) {
            this.phenotypeView = options.phenotypeView;
            this.selectedIndividualRowView = null;
            this.individualRowViews = [];
            this.listenTo(Darwin.vent, "generation-selected", this.generationSelected);
            this.listenTo(Darwin.vent, "individual-selected", this.selectIndividual);
        },

        generationSelected: function(generation) {
            this.model = generation;
            this.selectedIndividualRowView = null;
            this.individualRowViews = [];
            this.collection = new Backbone.Collection(this.model.get("population"));
            this.render();
        },

        render: function() {
            this.$el.html(this.template());
            if (this.collection) {
                var container = document.createDocumentFragment();
                for (var i = 0; i < this.collection.length; i++) {
                    var individual = this.collection.get(i);
                    var individualRowView = new Darwin.Views.IndividualRowView({
                        model: individual,
                        phenotypeView: this.phenotypeView
                    });
                    this.individualRowViews.push(individualRowView);
                    if (i == 0) {
                        individualRowView.customSelect();
                    }
                    container.appendChild(individualRowView.render().el);
                }
                this.$el.append(container);
            }
            return this;
        },

        selectIndividual: function(individual) {
            if (this.selectedIndividualRowView) {
                this.selectedIndividualRowView.unselect();
            }
            this.selectedIndividualRowView = this.individualRowViews[individual.get("id")];
            this.selectedIndividualRowView.select();
        }

    });

    Darwin.Views.IndividualRowView = Darwin.Views.SelectableRowView.extend({

        template: _.template(Darwin.Templates.individualRowView),

        initialize: function(options) {
            this.phenotypeView = options.phenotypeView
        },

        render: function() {
            this.$el.html(this.template({
                id: this.model.get("id"),
                fitness: this.model.get("fitness")
            }));
            this.$(".phenotype").append(new this.phenotypeView({
                actual: this.model.get("genotype")
            }).render().el);
            return this;
        },

        customSelect: function() {
            Darwin.vent.trigger("individual-selected", this.model);
        }

    });

    Darwin.Views.IndividualDetailsView = Backbone.View.extend({

        className: "widget widget-info individual-details-view",

        template: _.template(Darwin.Templates.individualDetailsView),

        initialize: function(options) {
            this.phenotypeView = options.phenotypeView;
            this.listenTo(Darwin.vent, "individual-selected", this.changeIndividual);
        },

        changeIndividual: function(individual) {
            this.model = individual;
            this.render();
        },

        render: function() {
            if (this.model) {
                this.$el.html(this.template({
                    id: this.model.get("id"),
                    generationId: this.model.get("generation").id,
                    fitness: this.model.get("fitness")
                }));
                this.$(".phenotype").append(new this.phenotypeView({
                    actual: this.model.get("genotype")
                }).render().el);
            }
            return this;
        }

    });

    Darwin.Views.GenerationsFitnessGraphView = Backbone.View.extend({

        className: "widget",

        initialize: function(options) {
            this.maxX = options.maxGenerations;
            this.maxY = options.maxFitness;
            this.data1 = [];
            //this.data2 = [];
            this.data3 = [];
            //this.data4 = [];
            this.data5 = [];
            this.renderBase();
        },

        addPoints: function(points) {
            this.data1.push(points.best);
            //this.data2.push(points.stdUp);
            this.data3.push(points.avg);
            //this.data4.push(points.stdDown);
            this.data5.push(points.worst);
            this.render();
        },

        renderBase: function() {

            var self = this;

            var margin = {
                    top:    30,
                    right:  30,
                    bottom: 45,
                    left:   45
                },
                width = 1000 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            this.x = d3.scale.linear()
                .domain([0, this.maxX])
                .range([0, width]);

            this.y = d3.scale.linear()
                .domain([0, this.maxY])
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(this.x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(this.y)
                .orient("left");

            this.line = d3.svg.line()
                .x(function(d) {
                    return self.x(d.id);
                })
                .y(function(d) {
                    return self.y(d.fitness);
                });

            this.area = d3.svg.area()
                .x(function(d) {
                    return self.x(d.id);
                })
                .y0(height)
                .y1(function(d) {
                    return self.y(d.fitness);
                });

            this.svg = d3.select(this.el).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("stroke", "#939ba5")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.path1 = self.svg.append("path");
            //this.path2 = self.svg.append("path");
            this.path3 = self.svg.append("path");
            //this.path4 = self.svg.append("path");
            this.path5 = self.svg.append("path");

            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("x", width / 2)
                .attr("y", 35)
                .attr("stroke", "#ecf1f4")
                .style("text-anchor", "middle")
                .text("Generations");

            this.svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -100)
                .attr("y", -27)
                .attr("stroke", "#ecf1f4")
                .style("text-anchor", "end")
                .text("Fitness");
        },

        render: function() {

            var self = this;

            //self.x.domain(d3.extent(self.data1, function (d) {
            //    return d.id;
            //}));
            //
            //self.y.domain(d3.extent(self.data, function (d) {
            //    return d.avgFitness;
            //}));

            // Best
            this.path1.datum(self.data1);
            this.path1.attr("d", self.area)
                .style({
                    "fill": "#00a93e",
                    "fill-opacity": .1,
                    "stroke": "#00a93e",
                    "stroke-width": "2px"
                });

            // Standard Deviation Over
            //this.path2.datum(self.data2);
            //this.path2.attr("d", self.area)
            //    .style({
            //        "fill": "F1FF",
            //        "fill-opacity": .1,
            //        "stroke": "#F1FF",
            //        "stroke-width": "2px"
            //    });

            // Average
            this.path3.datum(self.data3);
            this.path3.attr("d", self.area)
                .style({
                    "fill": "#3a76d0",
                    "fill-opacity": .1,
                    "stroke": "#3a76d0",
                    "stroke-width": "2px"
                });

            // Standard Deviation Under
            //this.path4.datum(self.data4);
            //this.path4.attr("d", self.area)
            //    .style({
            //        "fill": "#FFA787",
            //        "fill-opacity": .1,
            //        "stroke": "#FFA787",
            //        "stroke-width": "2px"
            //    });

            // Worst
            this.path5.datum(self.data5);
            this.path5.attr("d", self.area)
                .style({
                    "fill": "#CC3824",
                    "fill-opacity": .1,
                    "stroke": "#CC3824",
                    "stroke-width": "2px"
                });

            return this;
        }

    });

})(Darwin);
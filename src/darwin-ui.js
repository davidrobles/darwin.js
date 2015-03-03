var Darwin = Darwin || {};

(function(Darwin) {

    "use strict";

    Darwin.vent = _.extend({}, Backbone.Events);

    Darwin.Views = {};

    Darwin.Views.EAConfigurationView = Backbone.View.extend({

        className: "widget widget-info",

        template: _.template($("#ea-configuration-view").html()),

        events: {
            "click .start": "start",
            "click .reset": "reset"
        },

        initialize: function(ga) {
            this.ga = ga;
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        start: function() {
            this.run();
            this.ga.populationSize = parseInt(this.$(".population-size").val());
            this.ga.start();
        },

        run: function() {
            this.$(".population-size").prop("disabled", true);
            this.$(".start").prop("disabled", true);
            this.$(".reset").prop("disabled", false);
        },

        reset: function() {
            this.$(".population-size").prop("disabled", false);
            this.$(".start").prop("disabled", false);
            this.$(".reset").prop("disabled", true);
            this.ga.reset();
        }

    });

    Darwin.Views.EADetailsView = Backbone.View.extend({

        className: "widget widget-info",

        template: _.template($("#ea-details-view").html()),

        initialize: function(ga) {
            this.ga = ga;
        },

        render: function() {
            this.$el.html(this.template({
                populationSize: this.ga.populationSize,
                mutationProbability: "1%"
            }));
            return this;
        }

    });

    Darwin.Views.DashboardView = Backbone.View.extend({

        template: _.template($("#dashboard-layout").html()),

        className: "dashboard",

        initialize: function(options) {
            this.ga = options.ga;
            this.phenotypeView = options.phenotypeView;
            this.initSubviews();
            this.registerCallbacks();
        },

        initSubviews: function() {
            this.generationsCollection = new Backbone.Collection();
            this.generationsTableView = new Darwin.Views.GenerationsTableView({
                collection: this.generationsCollection,
                phenotypeView: this.phenotypeView
            });
            this.populationTableView = new Darwin.Views.PopulationTableView({
                phenotypeView: this.phenotypeView
            });
            this.individualDetailsView = new Darwin.Views.IndividualDetailsView({
                phenotypeView: this.phenotypeView
            });
            this.configurationView = new Darwin.Views.EAConfigurationView(this.ga);
            this.eaDetailsView = new Darwin.Views.EADetailsView(this.ga);
            this.graph = new Darwin.Views.EAGraph();
        },

        // TODO Refactor
        registerCallbacks: function() {
            var gensMap = {};

            this.listenTo(this.ga, "reset", function() {
                gensMap = {};
                this.generationsTableView.remove();
                this.populationTableView.remove();
                this.individualDetailsView.remove();
                this.initSubviews();
                this.render();
            });

            this.listenTo(this.ga, "ea-started", function() {
            });

            this.listenTo(this.ga, "generation-started", function(generation) {
                this.generationsCollection.add(generation);
                var last = this.generationsCollection.last();
                gensMap[last.get("id")] = last;
            });

            this.listenTo(this.ga, "generation-finished", function(generation) {
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
                        fitness: generation.averageFitness
                    },
                    worst: {
                        id: generation.id,
                        fitness: generation.worstIndividual.fitness
                    },
                    stdUp: {
                        id: generation.id,
                        fitness: generation.averageFitness + generation.stdFitness
                    },
                    stdDown: {
                        id: generation.id,
                        fitness: generation.averageFitness - generation.stdFitness
                    }
                });
            });
        },

        render: function() {
            this.$el.empty();
            this.$el.html(this.template());
            this.$(".dashboard-sidebar").append(this.configurationView.render().el);
            //this.$el.append(this.eaDetailsView.render().el);
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

        template: _.template($("#generations-table-view").html()),

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
            "complete": _.template($("#generation-row-view").html()),
            "in-progress": _.template($("#generation-row-view-in-progress").html())
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
                    bestIndividual: new this.phenotypeView({
                        actual: this.model.get("bestIndividual").genotype
                    }).render().el.innerHTML,
                    bestIndividualFitness: this.model.get("bestIndividual").fitness,
                    averageFitness: this.model.get("averageFitness") // TODO rename to avgFitness
                }));
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

        template: _.template($("#population-table-view").html()),

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

        template: _.template($("#individual-row-view").html()),

        initialize: function(options) {
            this.phenotypeView = options.phenotypeView
        },

        render: function() {
            this.$el.html(this.template({
                id: this.model.get("id"),
                phenotype: new this.phenotypeView({
                    actual: this.model.get("genotype")
                }).render().el.innerHTML,
                fitness: this.model.get("fitness")
            }));
            return this;
        },

        customSelect: function() {
            Darwin.vent.trigger("individual-selected", this.model);
        }

    });

    Darwin.Views.IndividualDetailsView = Backbone.View.extend({

        className: "widget widget-info individual-details-view",

        template: _.template($("#individual-details-view").html()),

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
                    phenotype: new this.phenotypeView({
                        actual: this.model.get("genotype")
                    }).render().el.innerHTML,
                    fitness: this.model.get("fitness")
                }));
            }
            return this;
        }

    });

    Darwin.Views.EAGraph = Backbone.View.extend({

        className: "widget",

        initialize: function() {
            this.maxX = 150;
            this.maxY = "GENETIC HELLO WORLD".length;
            this.data1 = [];
            this.data2 = [];
            this.data3 = [];
            this.data4 = [];
            this.data5 = [];
            this.renderBase();
        },

        addPoints: function(points) {
            this.data1.push(points.best);
            this.data2.push(points.stdUp);
            this.data3.push(points.avg);
            this.data4.push(points.stdDown);
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
                height = 350 - margin.top - margin.bottom;

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
            this.path2 = self.svg.append("path");
            this.path3 = self.svg.append("path");
            this.path4 = self.svg.append("path");
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
            this.path2.datum(self.data2);
            this.path2.attr("d", self.area)
                .style({
                    "fill": "F1FF",
                    "fill-opacity": .1,
                    "stroke": "#F1FF",
                    "stroke-width": "2px"
                });

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
            this.path4.datum(self.data4);
            this.path4.attr("d", self.area)
                .style({
                    "fill": "#FFA787",
                    "fill-opacity": .1,
                    "stroke": "#FFA787",
                    "stroke-width": "2px"
                });

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
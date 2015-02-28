Darwin.vent = _.extend({}, Backbone.Events);

var EAConfigurationView = Backbone.View.extend({

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

var DashboardView = Backbone.View.extend({

    className: "dashboard",

    initialize: function(options) {
        this.ga = options.ga;
        this.phenotypeView = options.phenotypeView;
        this.initSubviews();
        this.registerCallbacks();
    },

    initSubviews: function() {
        this.generationsCollection = new Backbone.Collection();
        this.generationsTableView = new GenerationsTableView({
            collection: this.generationsCollection,
            phenotypeView: this.phenotypeView
        });
        this.populationTableView = new PopulationTableView({
            phenotypeView: this.phenotypeView
        });
        this.individualDetailsView = new IndividualDetailsView({
            phenotypeView: this.phenotypeView
        });
        this.configurationView = new EAConfigurationView(this.ga);
        this.graph = new EAGraph();
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
        });
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.configurationView.render().el);
        this.$el.append(this.generationsTableView.render().el);
        this.$el.append(this.populationTableView.render().el);
        this.$el.append(this.individualDetailsView.render().el);
        this.$el.append(this.graph.render().el);
        return this;
    }

});

var GenerationsTableView = Backbone.View.extend({

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
        this.generationRowView = new GenerationRowView({
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

var SelectableRowView = Backbone.View.extend({

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

var GenerationRowView = SelectableRowView.extend({

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
                    actual: this.model.get("bestIndividual")
                }).render().el.innerHTML,
                bestIndividualFitness: this.model.get("bestIndividualFitness"),
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

var PopulationTableView = Backbone.View.extend({

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
                var individualRowView = new IndividualRowView({
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

var IndividualRowView = SelectableRowView.extend({

    template: _.template($("#individual-row-view").html()),

    initialize: function(options) {
        this.phenotypeView = options.phenotypeView
    },

    render: function() {
        this.$el.html(this.template({
            id: this.model.get("id"),
            phenotype: new this.phenotypeView({
                actual: this.model.get("individual")
            }).render().el.innerHTML,
            fitness: this.model.get("fitness")
        }));
        return this;
    },

    customSelect: function() {
        Darwin.vent.trigger("individual-selected", this.model);
    }

});

var IndividualDetailsView = Backbone.View.extend({

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
                phenotype: new this.phenotypeView({
                    actual: this.model.get("individual")
                }).render().el.innerHTML,
                fitness: this.model.get("fitness")
            }));
        }
        return this;
    }

});

var EAGraph = Backbone.View.extend({

    className: "widget",

    initialize: function() {
        this.renderBase();
    },

    renderBase: function() {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 560 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        this.x = d3.time.scale()
            .range([0, width]);

        this.y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left");
        var self = this;

        this.line = d3.svg.line()
            .x(function(d) { return self.x(d.date); })
            .y(function(d) { return self.y(d.close); });

        this.svg = d3.select(this.el).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    },

    render: function() {
        var parseDate = d3.time.format("%d-%b-%y").parse;
        var self = this;
        d3.tsv("/data.tsv", function(error, data) {
            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            self.x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            self.y.domain(d3.extent(data, function (d) {
                return d.close;
            }));
            self.svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", self.line);
        });
        return this;
    }

});
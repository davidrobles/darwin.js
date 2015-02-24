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
        this.individualView = options.individualView;
        this.initSubviews();
        this.registerCallbacks();
    },

    initSubviews: function() {
        this.GenerationsCollection = Backbone.Collection.extend();
        this.generationsCollection = new this.GenerationsCollection();
        this.generationsTableView = new GenerationsTableView({ collection: this.generationsCollection });
        this.populationTableView = new PopulationTableView();
        this.individualDetailsView = new IndividualDetailsView({
            individualView: this.individualView
        });
        this.configurationView = new EAConfigurationView(this.ga);
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
        return this;
    }

});

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "ea generations widget",

    template: _.template($("#generations-table-view").html()),

    initialize: function() {
        this.selectedGenerationRowView = null;
        this.generationRowViews = [];
        this.listenTo(Darwin.vent, "generation-selected", this.selectGeneration);
        if (this.collection) {
            this.listenTo(this.collection, "add", this.addGeneration);
        }
    },

    addGeneration: function(generation) {
        this.generationRowView = new GenerationRowView({
            model: generation
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

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    // TODO Refactor
    render: function() {
        var templateName = this.model.get("status");
        if (templateName === "complete") {
            var individualLabelView = new IndividualLabelView({
                actual: this.model.get("bestIndividual"),
                target: "EVOLUTION" // TODO Move to model configuration
            });
            this.$el.html(this.templates[templateName]({
                id: this.model.get("id"),
                bestIndividual: individualLabelView.render().el.innerHTML,
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

    initialize: function() {
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
            for (var i = 0; i < this.collection.length; i++) {
                var individual = this.collection.get(i);
                var individualRowView = new IndividualRowView({ model: individual });
                this.individualRowViews.push(individualRowView);
                if (i == 0) {
                    individualRowView.customSelect();
                }
                this.$el.append(individualRowView.render().el);
            }
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

    render: function() {
        var individualLabelView = new IndividualLabelView({
            actual: this.model.get("individual"),
            target: "EVOLUTION"
        });
        this.$el.html(this.template({
            id: this.model.get("id"),
            phenotype: individualLabelView.render().el.innerHTML,
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
        this.individualView = options.individualView;
        this.listenTo(Darwin.vent, "individual-selected", this.changeIndividual);
    },

    render: function() {
        if (this.model) {
            this.$el.html(this.template({
                id: this.model.get("id"),
                phenotype: new this.individualView({
                    actual: this.model.get("individual")
                }).render().el.innerHTML,
                fitness: this.model.get("fitness")
            }));
        }
        return this;
    },

    changeIndividual: function(individual) {
        this.model = individual;
        this.render();
    }

});

var IndividualLabelView = Backbone.View.extend({

    tagName: "p",

    initialize: function(opts) { // Change options in the other views!
        this.actual = opts.actual;
        this.target = "EVOLUTION";
    },

    render: function() {
        for (var i = 0; i < this.target.length; i++) {
            if (this.target.charAt(i) === this.actual.charAt(i)) {
                this.$el.append('<span style="color: rgb(141, 199, 63);">' + this.actual.charAt(i) + '</span>');
            } else {
                this.$el.append('<span style="color: rgb(237, 28, 36);">' + this.actual.charAt(i) + "</span>");
            }
        }
        return this;
    }

});

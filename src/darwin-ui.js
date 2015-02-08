Darwin.vent = _.extend({}, Backbone.Events);

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "generations",

    template: _.template($("#generations-table-view").html()),

    initialize: function() {
        this.selectedGenerationRowView = null;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
    },

    addNewGeneration: function() {
        this.generationRowView = new GenerationRowView();
        this.listenTo(this.generationRowView, "generation-selected", this.generationSelected);
        this.$("tbody").append(this.generationRowView.render().el);
    },

    updateGeneration: function(generation) {
        this.generationRowView.generation = generation;
        this.generationRowView.render();
    },

    generationSelected: function(generationRowView) {
        if (this.selectedGenerationRowView) {
            this.selectedGenerationRowView.unselect();
        }
        generationRowView.select();
        this.selectedGenerationRowView = generationRowView;
        Darwin.vent.trigger("generation-selected", this.selectedGenerationRowView.generation);
    }

});

var GenerationRowView = Backbone.View.extend({

    tagName: "tr",

    templates: {
        "finished": _.template($("#generation-row-view").html()),
        "inProgress": _.template($("#generationRowViewEmpty").html())
    },

    events: {
        "click": "selectClick"
    },

    initialize: function() {
        this.generation = null;
        this.selected = false;
    },

    render: function() {
        if (this.generation) {
            this.$el.html(this.templates["finished"](this.generation));
        } else {
            this.$el.html(this.templates["inProgress"]());
        }
        return this;
    },

    selectClick: function() {
        this.trigger("generation-selected", this);
    },

    select: function() {
        this.$el.css('background-color', '#91C2CE');
    },

    unselect: function() {
        this.$el.css('background-color', '');
    }

});

var GenerationDetailsView = Backbone.View.extend({

    tagName: "div",

    className: "generation-details",

    template: _.template($("#generation-details-view").html()),

    initialize: function(generation) {
        this.generation = generation;
        this.listenTo(Darwin.vent, "generation-selected", this.generationSelected);
    },

    render: function() {
        this.$el.empty();
        this.$el.html(this.template(this.generation));

        //var generationDetailsView = new GenerationDetailsView(this.generation);
        //$(".generationDetails").html(generationDetailsView.render().el);
        var populationTableView = new PopulationTableView(this.generation.population);
        this.$el.append(populationTableView.render().el);
        return this;
    },

    generationSelected: function(generation) {
        this.generation = generation;
        this.render();
    }

});

var PopulationTableView = Backbone.View.extend({

    tagName: "table",

    className: "population",

    template: _.template($("#population-table-view").html()),

    initialize: function(population) {
        this.population = population;
    },

    render: function() {
        this.$el.html(this.template());

        for (var i = 0; i < 15; i++) {
            var candidate = this.population[i];
            var candidateRowView = new CandidateRowView({candidate: candidate});
            this.$el.append(candidateRowView.render().el);
        }
        //this.population.forEach(
        //    function(candidate) { // change name to evaluated candidate?
        //        var candidateRowView = new CandidateRowView({candidate: candidate});
        //        this.$el.append(candidateRowView.render().el);
        //    },
        //    this
        //);
        return this;
    }

});

var CandidateRowView = Backbone.View.extend({

    tagName: "tr",

    template: _.template($("#candidate-row-view").html()),

    initialize: function(options) {
        options = options || {};
        this.candidate = options.candidate;
    },

    render: function() {
        var candidateLabelView = new CandidateLabelView({
            actual: this.candidate.candidate,
            target: "THIS IS A TEST ON GENETIC ALGORITHMS"
        });

        var rendered = candidateLabelView.render();
        var output = rendered.el.innerHTML;

        this.$el.html(this.template({
            id: this.candidate.id,
            candidate: output,
            fitness: this.candidate.fitness
        }));
        return this;
    }

});

var CandidateLabelView = Backbone.View.extend({

    tagName: "p",

    initialize: function(opts) { // Change options in the other views!
        this.actual = opts.actual;
        this.target = opts.target;
    },

    render: function() {
        for (var i = 0; i < this.target.length; i++) {
            if (this.target.charAt(i) === this.actual.charAt(i)) {
                this.$el.append('<span style="color: #ff0000;">' + this.actual.charAt(i) + '</span>');
            } else {
                this.$el.append("<span>" + this.actual.charAt(i) + "</span>");
            }
        }
        return this;
    }

});

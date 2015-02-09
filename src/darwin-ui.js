Darwin.vent = _.extend({}, Backbone.Events);

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "generations",

    template: _.template($("#generations-table-view").html()),

    initialize: function() {
        this.selectedGenerationRowView = null;
        this.allViews = [];
        this.listenTo(Darwin.vent, "generation-selected", this.generationSelected);
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
    },

    generationSelected: function(generation) {
        var generationRowView = this.allViews[generation.generation]; // TODO change to generation.no/number?
        if (this.selectedGenerationRowView) {
            this.selectedGenerationRowView.unselect();
        }
        generationRowView.select();
        this.selectedGenerationRowView = generationRowView;
    },

    addNewGeneration: function() {
        this.generationRowView = new GenerationRowView();
        this.$("tbody").append(this.generationRowView.render().el);
        this.allViews.push(this.generationRowView);
    },

    updateGeneration: function(generation) {
        this.generationRowView.generation = generation;
        this.generationRowView.render();
        this.generationSelected(generation); // TODO: move to addNewGeneration, or even better make it a model
        this.$("tbody").scrollTop(100000);
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
        //this.selected = false; // TODO remove this?
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
        Darwin.vent.trigger("generation-selected", this.generation);
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
        this.$el.html(this.template(this.generation));
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
        this.selectedCandidateRowView = null;
        this.listenTo(Darwin.vent, "candidate-selected", this.candidateSelected);
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
    },

    addNewCandidate: function(candidate) {
        this.candidateRowView = new CandidateRowView();
        //this.listenTo(Darwin.vent, "candidate-selected", this.candidateSelected);
    },

    updateCandidate: function(candidate) {
        this.candidateRowView.candidate = candidate;
        this.candidateRowView.render();
    },

    candidateSelected: function(candidateRowView) {
        console.log('got here at least');
        if (this.selectedCandidateRowView) {
            this.selectedCandidateRowView.unselect();
        }
        candidateRowView.select();
        this.selectedCandidateRowView = candidateRowView;
        //Darwin.vent.trigger("candidate-selected", this.selectedCandidateRowView.candidate);
    }

});

var CandidateRowView = Backbone.View.extend({

    tagName: "tr",

    template: _.template($("#candidate-row-view").html()),

    events: {
        "click": "selectClick"
    },

    initialize: function(options) {
        options = options || {};
        this.candidate = options.candidate; // TODO remove this?
    },

    render: function() {
        var candidateLabelView = new CandidateLabelView({
            actual: this.candidate.candidate,
            target: "EVOLVING HELLO WORLD!"
        });

        var rendered = candidateLabelView.render();
        var output = rendered.el.innerHTML;

        this.$el.html(this.template({
            id: this.candidate.id,
            candidate: output,
            fitness: this.candidate.fitness
        }));
        return this;
    },

    selectClick: function() {
        Darwin.vent.trigger("candidate-selected", this);
    },

    select: function() {
        this.$el.css('background-color', '#91C2CE');
    },

    unselect: function() {
        this.$el.css('background-color', '');
    }

});

var CandidateDetailsView = Backbone.View.extend({

    tagName: "div",

    className: "candidate-details",

    template: _.template($("#candidate-details-view").html()),

    initialize: function() {
        this.candidate = null;
        //this.listenTo(Darwin.vent, "candidate-selected", this.changeCandidate);
    },

    render: function() {
        this.$el.html("Candidate Details");
        return this;
    },

    changeCandidate: function(candidate) {
        this.render();
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

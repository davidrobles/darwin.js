Darwin.vent = _.extend({}, Backbone.Events);

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "generations",

    template: _.template($("#generations-table-view").html()),

    initialize: function() {
        this.selectedGenerationRowView = null;
        this.generationRowViews = [];
        this.listenTo(Darwin.vent, "generation-selected", this.selectGeneration);
        this.listenTo(this.collection, "add", this.addGeneration);
    },

    addGeneration: function(generation) {
        this.generationRowView = new GenerationRowView({ model: generation });
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
            this.selectedGenerationRowView.unselect();
        }
        this.selectedGenerationRowView = this.generationRowViews[generation.get("number")];
    }

});

var GenerationRowView = Backbone.View.extend({

    tagName: "tr",

    templates: {
        "complete": _.template($("#generation-row-view").html()),
        "in-progress": _.template($("#generation-row-view-in-progress").html())
    },

    events: {
        "click": "select"
    },

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        var templateName = this.model.get("status");
        this.$el.html(this.templates[templateName](this.model.toJSON()));
        return this;
    },

    select: function() {
        Darwin.vent.trigger("generation-selected", this.model);
        this.$el.css('background-color', '#91C2CE'); // TODO move this color to a class
    },

    unselect: function() {
        this.$el.css('background-color', '');
    }

});

var GenerationDetailsView = Backbone.View.extend({

    tagName: "div",

    className: "generation-details",

    template: _.template($("#generation-details-view").html()),

    initialize: function() {
        this.listenTo(Darwin.vent, "generation-selected", this.generationSelected);
    },

    generationSelected: function(generation) {
        this.model = generation;
        this.render();
    },

    // TODO listener if the model changes? how to do that?

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        var populationTableView = new PopulationTableView(this.model.get("population"));
        this.$el.append(populationTableView.render().el);
        return this;
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

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "generations",

    template: _.template($("#generations-table-view").html()),

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
    },

    addNewGeneration: function() {
        this.generationRowView = new GenerationRowView();
        this.$("tbody").append(this.generationRowView.render().el);
    },

    updateGeneration: function(generation) {
        this.generationRowView.generation = generation;
        this.generationRowView.render();
    }

});

var GenerationRowView = Backbone.View.extend({

    tagName: "tr",

    templates: {
        "finished": _.template($("#generation-row-view").html()),
        "inProgress": _.template($("#generationRowViewEmpty").html())
    },

    events: {
        "click": "select"
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

    select: function() {
        //this.$el.css('background-color', '#ff0000');
        var generationDetailsView = new GenerationDetailsView(this.generation);
        $(".generationDetails").html(generationDetailsView.render().el);
        var populationTableView = new PopulationTableView(this.generation.population);
        $(".generationDetails").append(populationTableView.render().el);
    }

});

var GenerationDetailsView = Backbone.View.extend({

    tagName: "div",

    className: "generation-details",

    template: _.template($("#generation-details-view").html()),

    initialize: function(generation) {
        this.generation = generation;
    },

    render: function() {
        this.$el.empty();
        this.$el.html(this.template(this.generation));

        //var generationDetailsView = new GenerationDetailsView(this.generation);
        //$(".generationDetails").html(generationDetailsView.render().el);
        var populationTableView = new PopulationTableView(this.generation.population);
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
    },

    render: function() {
        this.$el.html(this.template());

        this.population.forEach(
            function(candidate) { // change name to evaluated candidate?
                //var text = candidate.candidate;
                //var candidateLabelView = new CandidateLabelView({
                //    actual: text,
                //    target: "THIS IS A TEST ON GENETIC ALGORITHMS"
                //});
                //var hola = candidateLabelView.render().el;
                ////candidate.candidate = hola.innerHTML;
                //this.$el.append(this.templateRow(candidate));
                var candidateRowView = new CandidateRowView({candidate: candidate});
                this.$el.append(candidateRowView.render().el);
            },
            this
        );
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
            //candidate: this.candidate.candidate,
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


var GenerationRowView = Backbone.View.extend({
    tagName: "tr",
    className: "even",
    template: _.template($("#generationRowView").html()),
    initialize: function(opts) {
        this.generation = opts.generation;
        this.className = opts.className;
        this.selected = false;
    },
    render: function() {
       this.$el.html(this.template(this.generation));
       return this;
    },
    events: {
        'click': 'select'
    },
    select: function() {
        this.$el.css('background-color', '#ff0000');
        var generationDetailsView = new GenerationDetailsView(this.generation);
        $(".generationDetails").html(generationDetailsView.render().el);
        var populationTableView = new PopulationTableView(this.generation.population);
        $(".generationDetails").append(populationTableView.render().el);
    }
});

var GenerationsTableView = Backbone.View.extend({
    tagName: "table",
    className: "generations",
    initialize: function(generations) {
        this.generations = generations;
    },
	template: _.template($("#generationsTableView").html()),
    render: function() {
        // change to _.each
		this.$el.append(this.template());
        // this.generations.forEach(function(generation) {
        //         var generationRowView = new GenerationRowView();
        //     },
        //     this
        // );
        return this;
    },
    clearAll: function() {
        alert('testing');
    }
});

var GenerationDetailsView = Backbone.View.extend({
    tagName: "div",
    initialize: function(generation) {
        this.generation = generation;
    },
    render: function() {
        this.$el.html("<p>Generation:      " + this.generation.generation + "</p>" +
                      "<p>Best candidate:  " + this.generation.bestCandidate + "</p>" +
                      "<p>Best fitness:    " + this.generation.bestFitness + "</p>" +
                      "<p>Average fitness: " + this.generation.averageFitness + "</p>");
        return this;
    }
});

var PopulationTableView = Backbone.View.extend({
    tagName: "table",
    initialize: function(population) {
        this.population = population;
    },
    template: _.template("<tr>" +
                         "<td><%= candidate %></td>" +
                         "<td><%= fitness %></td>" +
                         "</tr>"),
    render: function() {
        this.population.forEach(
            function(candidate) { // change name to evaluated candidate?
                var text = candidate.candidate;
                var candidateLabelView = new CandidateLabelView({
                    actual: text,
                    target: "THIS IS A TEST ON GENETIC ALGORITHMS"
                });
                var hola = candidateLabelView.render().el;
                candidate.candidate = hola.innerHTML;
                this.$el.append(this.template(candidate));
            },
            this
        );
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
                this.$el.append('<span>' + this.actual.charAt(i) + '</span>');
            }
        }
        return this;
    }
});


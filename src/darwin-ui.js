var GenerationRowView = Backbone.View.extend({

    tagName: "tr",
    
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
        // this.$el.css('background-color', '#ff0000');
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
        this.preRender();
    },

    template: _.template($("#generationsTableView").html()),

    preRender: function() {
        this.$el.empty();
        this.$el.append(this.template());
        for (var i = 0; i < 10; i++)  {
            this.$el.append("<tr><td></td><td></td><td></td><td></td><td></td></tr>");
        }
    },

    render: function() {
        // $(".generations").append(generationRowView.render().el);
        for (var i = 0; i < 10; i++)  {
            if (this.generations[i] === undefined) {
                continue;
            }
            var generationRowView = new GenerationRowView({
                generation: this.generations[i],
            });
            this.$("tbody tr:nth-child(" + i + ")").replaceWith(generationRowView.render().el);
        }
        return this;
    }

});

var GenerationDetailsView = Backbone.View.extend({

    tagName: "div",

    initialize: function(generation) {
        this.generation = generation;
    },

    template: _.template($("#generationDetailsView").html()),

    render: function() {
        this.$el.html(this.template(this.generation));
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

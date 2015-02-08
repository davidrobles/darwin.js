var GenerationRowView = Backbone.View.extend({

    tagName: "tr",

    templates: {
        "finished": _.template($("#generationRowView").html()),
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
            this.$el.html(this.templates["inProgress"]);
        }
        return this;
    },

    select: function() {
        // this.$el.css('background-color', '#ff0000');
        var generationDetailsView = new GenerationDetailsView(this.generation);
        $(".generationDetails").html(generationDetailsView.render().el);
        var populationTableView = new PopulationTableView(this.generation.population);
        $(".generationDetails").append(populationTableView.render().el);
    }

});

//var GenerationsTableViewFooter = Backbone.View.extend({
//
//    tagName: "tfoot",
//
//    template: _.template($("#generationsTableViewFooter").html()),
//
//    initialize: function(opts) {
//
//    },
//
//    render: function() {
//        this.$el.replaceWith(this.template());
//    },
//
//
//    countTotalPages: function() {
//        return Math.floor(((this.generations.length - 1) / this.numRows)) + 1;
//    }
//
//});

var GenerationsTableView = Backbone.View.extend({

    tagName: "table",

    className: "generations",

    initialize: function() {
        this.render();
    },

    template: _.template($("#generationsTableView").html()),

    footerTemplate: _.template($("#generationsTableViewFooter").html()),

    renderFooter: function() {
        this.$("tfoot").replaceWith(this.footerTemplate({
            totalPages: this.countTotalPages()
        }));
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
    },

    addNewGeneration: function() {
        this.generationRowView = new GenerationRowView({});
        this.$("tbody").append(this.generationRowView.render().el);
    },

    updateGeneration: function(generation) {
        this.generationRowView.generation = generation;
        this.generationRowView.render();
    }

});

var GenerationDetailsView = Backbone.View.extend({

    tagName: "div",

    initialize: function(generation) {
        this.generation = generation;
    },

    template: _.template($("#generationDetailsView").html()),

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

    template: _.template($("#populationTableView").html()),

    initialize: function(population) {
        this.population = population;
    },

    templateRow: _.template("<tr>" +
                         "<td><%= candidate %></td>" +
                         "<td><%= fitness %></td>" +
                         "</tr>"),

    render: function() {
        this.$el.html(this.template());

        this.population.forEach(
            function(candidate) { // change name to evaluated candidate?
                var text = candidate.candidate;
                var candidateLabelView = new CandidateLabelView({
                    actual: text,
                    target: "THIS IS A TEST ON GENETIC ALGORITHMS"
                });
                var hola = candidateLabelView.render().el;
                //candidate.candidate = hola.innerHTML;
                this.$el.append(this.templateRow(candidate));
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
            //if (this.target.charAt(i) === this.actual.charAt(i)) {
            //    this.$el.append('<span style="color: #ff0000;">' + this.actual.charAt(i) + '</span>');
            //} else {
                this.$el.append("<span>" + this.actual.charAt(i) + "</span>");
            //}
        }
        return this;
    }

});

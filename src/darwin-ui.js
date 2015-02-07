var GenerationRowView = Backbone.View.extend({

    tagName: "tr",
    
    template: _.template($("#generationRowView").html()),

    templateRunning: _.template($("#generationRowViewEmpty").html()),

    initialize: function(opts) {
        this.generation = opts.generation;
        this.className = opts.className;
        this.selected = false;
    },

    render: function() {
        this.$el.html(this.template(this.generation));
        return this;
    },

    renderEmpty: function() {
        this.$el.html(this.templateRunning());
        return this;
    },

    events: {
        "click": "select"
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

    initialize: function(opts) {
        this.generations = opts.generations;
        //this.numRows = opts.numRows;
        //this.curPage = 1
        this.preRender();
    },

    template: _.template($("#generationsTableView").html()),

    footerTemplate: _.template($("#generationsTableViewFooter").html()),

    preRender: function() {
        this.$el.empty();
        this.$el.append(this.template());
    //    for (var i = 0; i < this.numRows; i++)  {
    //        this.$el.append("<tr><td></td><td></td><td></td><td></td><td></td></tr>");
    //    }
    },

    renderFooter: function() {
        this.$("tfoot").replaceWith(this.footerTemplate({
            totalPages: this.countTotalPages()
        }));
    },

    render: function() {
        // $(".generations").append(generationRowView.render().el);
        // TODO call empty()
        for (var i = 0; i < this.generations.length; i++)  {
            var generationRowView = new GenerationRowView({
                generation: this.generations[i]
            });
            // jQuery nth child indexes start from 1!
            this.$("tbody tr:nth-child(" + i + ")").replaceWith(generationRowView.render().el);
        }
        //this.renderFooter();
        return this;
    },

    addNewGeneration: function() {
        this.generationRowView = new GenerationRowView({});
        this.$("tbody").append(this.generationRowView.renderEmpty().el);
    },

    updateGeneration: function(generation) {
        this.generationRowView.generation = generation;
        this.generationRowView.render();
    }

    //nextPage: function() {
    //    this.render();
    //},

    //previousPage: function() {
    //    this.render();
    //},

    //goToPage: function(page) {
    //    this.render();
    //},

    //countTotalPages: function() {
    //    return Math.floor(((this.generations.length - 1) / this.numRows)) + 1;
    //}

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
                this.$el.append("<span>" + this.actual.charAt(i) + "</span>");
            }
        }
        return this;
    }

});

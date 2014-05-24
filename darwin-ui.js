
var GenerationRowView = Backbone.View.extend({
    tagName: "tr",
    template: _.template('<td><%= generation %></td>' +
                         '<td><%= bestCandidate %></td>' +
                         '<td><%= bestFitness %></td>' +
                         '<td style="background-color: rgba(0, 0, 255, <%= averageFitness / 36 %>)"><%= averageFitness %></td>'),
    initialize: function(generation) {
        this.generation = generation;
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
    }
});

var GenerationsTableView = Backbone.View.extend({
    tagName: "table",
    className: "generations",
    initialize: function(generations) {
        this.generations = generations;
    },
    render: function() {
        // change to _.each
        this.$el.append('<thead><tr>'
            + '<th>Generation</th>'
            + '<th>Best Candidate</th>'
            + '<th>Best Fitness</th>'
            + '<th>Average</th>'
            + '</tr></thead>');
        this.generations.forEach(function(generation) {
            this.$el.append(new GenerationRowView(generation).render().el);
        },
        this);
        return this;
    }
});

var GenerationDetailsView = Backbone.View.extend({
    tagName: "div",
    initialize: function(generation) {
        this.generation = generation;
    },
    render: function() {
        this.$el.html("<p>Generation:      " + this.generation.generation + "</p>" +
                      "<p>Best candidate:    " + this.generation.bestCandidate + "</p>" +
                      "<p>Best fitness:    " + this.generation.bestFitness + "</p>" +
                      "<p>Average fitness: " + this.generation.averageFitness + "</p>");
        return this;
    }
});


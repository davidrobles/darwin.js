
var GenerationRowView = Backbone.View.extend({
    tagName: "tr",
    template: _.template('<td><%= generation %></td>' +
                         '<td><%= bestCandidate %></td>' +
                         '<td><%= bestFitness %></td>' +
                         '<td style="background-color: rgba(0, 0, 255, <%= averageFitness / 36 %>)"><%= averageFitness %></td>'),
    initialize: function(generation) {
        this.generation = generation;
    },
    render: function() {
       this.$el.html(this.template(this.generation));
       return this;
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

var PopulationTableView = Backbone.View.extend({
    initialize: function(data) {
        this.data = data;
    }
});

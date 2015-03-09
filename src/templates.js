var Darwin = Darwin || {};

(function(Darwin) {

    Darwin.Templates = {

        dashboardLayout: ' \
            <div class="dashboard-sidebar"></div> \
            <div class="dashboard-content"></div> \
        ',

        generationRowView: ' \
            <td><%= id %></td> \
            <td><div class="phenotype"></div></td>\
            <td><%= bestIndividualFitness %></td> \
            <td><%= averageFitness.toFixed(2) %></td> \
        ',

        generationRowViewInProgress: ' \
            <td><%= id %></td> \
            <td>In progress...</td> \
            <td></td> \
            <td></td> \
        ',

        individualRowView: ' \
            <td><%= id %></td> \
            <td><div class="phenotype"></div></td> \
            <td><span class="worst-fitness"><%= fitness %></span></td> \
        ',

        populationTableView: ' \
            <thead> \
                <tr> \
                    <th colspan="3" class="table-title">Population</th> \
                </tr> \
                <tr> \
                    <th>#</th> \
                    <th>Phenotype</th> \
                    <th>Fitness</th> \
                </tr> \
            </thead> \
            <tbody></tbody> \
        ',

        generationsTableView: ' \
            <thead> \
                <tr> \
                    <th colspan="4" class="table-title">Generations</th> \
                </tr> \
                <tr> \
                    <th>#</th> \
                    <th>Best Individual</th> \
                    <th>Best Fitness</th> \
                    <th>Avg. Fitness</th> \
                </tr> \
            </thead> \
            <tbody></tbody> \
        ',

        individualDetailsView: ' \
            <div class="widget-title">Individual</div> \
            <div class="widget-content"> \
                <table class="ea"> \
                    <tr> \
                        <td>Generation:</td> \
                        <td><%= generationId %></td> \
                    </tr> \
                    <tr> \
                        <td>Individual:</td> \
                        <td><%= id %></td> \
                    </tr> \
                    <tr> \
                        <td>Phenotype:</td> \
                        <td><div class="phenotype"></div></td> \
                    </tr> \
                    <tr> \
                        <td>Fitness:</td> \
                        <td><%= fitness %></td> \
                    </tr> \
                </table> \
            </div> \
        ',

        evolutionaryAlgorithmConfigurationView: ' \
            <p class="widget-title">Evolutionary Algorithm<br/>Configuration</p> \
            <div class="widget-content"> \
                <label> \
                    Type: \
                    <select class="ea-type"> \
                        <option value="GA" selected="selected">Genetic Algorithm</option> \
                        <option value="ES">Evolution Strategy</option> \
                    </select> \
                </label> \
                <br/><br/> \
                <div class="ea-type-view"></div> \
                <br/><br/> \
                <button class="start">Start</button> \
                <button class="reset" disabled="disabled">Reset</button> \
            </div> \
        ',

        evolutionaryStrategyConfigurationView: ' \
            <table> \
                <tr> \
                    <td>μ (No. parents):</td> \
                    <td><input type="text" name="parents-size" value="<%= parentsSize %>" class="small" /></td> \
                </tr> \
                <tr> \
                    <td>λ (No. children):</td> \
                    <td><input type="text" name="children-size" value="<%= childrenSize %>" class="small" /></td> \
                </tr> \
                <tr> \
                    <td>Survivor selection:</td> \
                    <td> \
                        <select name="plus-selection"> \
                            <option value="false"<% if (!plusSelection) { %>selected="selected"<% } %>>(μ, λ)</option> \
                            <option value="true"<% if (plusSelection) { %>selected="selected"<% } %>>(μ + λ)</option> \
                        </select> \
                    </td> \
                </tr> \
                <tr> \
                    <td>Mutation rate:</td> \
                    <td><input type="text" name="mutation-rate" value="<%= mutationRate * 100 %>" class="small" /> %</td> \
                </tr> \
            </table> \
        ',

        geneticAlgorithmConfigurationView: ' \
            <table> \
                <tr> \
                    <td>Population size:</td> \
                    <td><input type="text" name="population-size" value="<%= populationSize %>" class="small" /></td> \
                </tr> \
                <tr> \
                    <td>Recombination rate:</td> \
                    <td><input type="text" name="recombination-rate" value="<%= recombinationRate * 100 %>" class="small" /> %</td> \
                </tr> \
                <tr> \
                    <td>Mutation rate:</td> \
                    <td><input type="text" name="mutation-rate" value="<%= mutationRate * 100 %>" class="small" /> %</td> \
                </tr> \
            </table> \
        '

    };

})(Darwin);
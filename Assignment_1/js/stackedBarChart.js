class StackedAreaChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Array}
     */
    constructor(_data) {
        this.margin = { top: 20, right: 40, bottom: 60, left: 40 };
        this.width = 1200 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.displayType = 'Bar';
        this.legendType = 'vis';
        this.data = _data;
        this.renderVis();
    }

    displayLegend() {
        let choices = data.columns.slice(1);
        let vis = this;
        if (vis.legendType == 'vis') {
            let data_legend = []
            console.log(choices)
            let colors = d3.schemeSpectral[choices.length];
            for (let x in colors) {
                let single = new Object();
                single['color'] = colors[x];
                single['cata'] = choices[x];
                data_legend.push(single);
            }
            // console.log(data_legend);
            for (let it in data_legend) {
                d3.select('#bar-chart').append('rect')
                    .attr('class', 'v')
                    .attr('fill', data_legend[it]['color'])
                    .attr('x', 250 + 100 * it)
                    .attr('y', 10)
                    .attr("width", 100)
                    .attr("height", 20);
                d3.select('#bar-chart').append('text')
                    .attr('class', 'v')
                    .attr('x', 250 + 100 * it)
                    .attr('y', 0)
                    .text(data_legend[it]['cata'])
            }
        } else {
            d3.selectAll('.v').remove();
            // d3.select('.col-right').append('svg').attr('id', 'bar-chart');
        }
    }

    renderVis() {
        let vis = this;
        let choices = data.columns.slice(1);
        let res = choices.flatMap(choice => data.map(d => ({ state: d['State'], choice, population: d[choice] })))
        if (vis.displayType == 'Bar') {
            // Visualzie Bar Chart
            // TO DO
            StackedBarChart(res, {
                x: d => d.state,
                y: d => d.population,
                z: d => d.choice,
                // xDomain: d3.groupSort(res, D => d3.sum(D, d => -d.population), d => d.state),
                yLabel: "Population",
                zDomain: choices,
                colors: Array(choices.length).fill('#3288bd'),
            })

        } else if (vis.displayType == 'Stacked') {
            // Visualize Stacked Bar Chart
            // TO DO
            StackedBarChart(res, {
                x: d => d.state,
                y: d => d.population,
                z: d => d.choice,
                // xDomain: d3.groupSort(res, D => d3.sum(D, d => -d.population), d => d.state),
                yLabel: "Population",
                zDomain: choices,
                colors: d3.schemeSpectral[choices.length],
            });
            this.displayLegend();

        } else if (vis.displayType == 'Sorted') {
            StackedBarChart(res, {
                x: d => d.state,
                y: d => d.population,
                z: d => d.choice,
                xDomain: d3.groupSort(res, D => d3.sum(D, d => -d.population), d => d.state),
                yLabel: "Population",
                zDomain: choices,
                colors: d3.schemeSpectral[choices.length],
            });
            this.displayLegend();
        }
    }
}
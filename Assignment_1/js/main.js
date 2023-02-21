// Initialize helper function

let data, stackedBarChart;

/**
 * Load data from CSV file asynchronously and render area chart
 */
d3.csv('data/A1_Data.csv')
    .then(_data => {
        // get the keys from the data and compute the total population (you are required to use sum function)

        // TO DO
        console.log(_data)

        data = _data;
        // Initialize and render chart
        stackedBarChart = new StackedAreaChart(data);
    });


/**
 * Select box event listener
 */

// 
d3.select('#display-type-selection').on('change', function() {
    // Get selected display type and update chart
    stackedBarChart.displayType = d3.select(this).property('value');
    stackedBarChart.renderVis();
});

d3.select('#islegend').on('change', function() {
    stackedBarChart.legendType = d3.select(this).property('value');
    stackedBarChart.displayLegend();
});
class ForceDirectedGraph {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 800,
            containerHeight: 800,
            margin: { top: 25, right: 20, bottom: 20, left: 35 }
        }
        this.data = _data;
        this.initVis();
    }

    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
        let vis = this;

        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.config.width_l = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height_l = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        // Define size of SVG drawing area
        vis.local = d3.select(vis.config.parentElement).append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', 'local');


        // Append group element that will contain our actual chart 
        // and position it according to the given margin config


        // define node and link

        // To DO


        // define force simulation

        // To DO

        // define a tooltip for showing text

        // To DO



        vis.linkedByIndex = {};

        // Build a dictionary (i.e., linkedByIndex) which will be used in isConnected function

        // To DO


        vis.updateVis();

    }

    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
        let vis = this;

        // Add node-link data to simulation

        // To DO

        // Map color to the node

        // To DO

        vis.renderVis();
    }

    /**
     * Bind data to visual elements.
     */
    renderVis() {
        let vis = this;

        // Visualzie graph

        // To DO


    }


    fade(opacity) {

        // To DO

    }

    isConnected(a, b) {

        // To DO

    }
}
async function drawScatter() {

    // 1. Access data

    const dataset = await d3.json("./data/my_weather_data.json")

    // set data constants

    // Get data attributes, i.e. xAccessor for max temperature and yAccessor for min temperature 
    // To DO
    console.log(dataset)

    // function xAccessor(d) {
    //     return d['temperatureMax']
    // }

    // function yAccessor(d) {
    //     return d['temperatureMin']
    // }

    const colorScaleYear = 2000
    const parseDate = d3.timeParse("%Y-%m-%d")
    const colorAccessor = d => parseDate(d.date).setYear(colorScaleYear)

    // Create chart dimensions

    const width = d3.min([
        window.innerWidth * 0.75,
        window.innerHeight * 0.75,
    ])
    let dimensions = {
        width: width,
        height: width,
        margin: {
            top: 90,
            right: 90,
            bottom: 50,
            left: 50,
        },
        legendWidth: 250,
        legendHeight: 26,
    }
    dimensions.boundedWidth = dimensions.width -
        dimensions.margin.left -
        dimensions.margin.right
    dimensions.boundedHeight = dimensions.height -
        dimensions.margin.top -
        dimensions.margin.bottom

    // Draw 

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

    const boundsBackground = bounds.append("rect")
        .attr("class", "bounds-background")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", 0)
        .attr("height", dimensions.boundedHeight)

    // Create scales
    // Create scales for x, y, and color (i.e., xScale, yScale, and colorScale)
    // To DO
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d['temperatureMax'])])
        .range([0, dimensions.width]);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d['temperatureMin'])])
        .range([0, dimensions.width])

    // 5. Draw data 

    // draw data into a scatter plot

    // To DO


    // 6. Draw peripherals

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .ticks(4)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("class", "x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .html("Minimum Temperature (&deg;F)")

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 10)
        .html("Maximum Temperature (&deg;F)")

    const legendGroup = bounds.append("g")
        .attr("transform", `translate(${
        dimensions.boundedWidth - dimensions.legendWidth - 9
      },${
        dimensions.boundedHeight - 37
      })`)

    const defs = wrapper.append("defs")

    const numberOfGradientStops = 10
    const stops = d3.range(numberOfGradientStops).map(i => (
        i / (numberOfGradientStops - 1)
    ))
    const legendGradientId = "legend-gradient"
    const gradient = defs.append("linearGradient")
        .attr("id", legendGradientId)
        .selectAll("stop")
        .data(stops)
        .join("stop")
        .attr("stop-color", d => d3.interpolateRainbow(-d))
        .attr("offset", d => `${d * 100}%`)

    const legendGradient = legendGroup.append("rect")
        .attr("height", dimensions.legendHeight)
        .attr("width", dimensions.legendWidth)
        .style("fill", `url(#${legendGradientId})`)

    const tickValues = [
        d3.timeParse("%m/%d/%Y")(`4/1/${colorScaleYear}`),
        d3.timeParse("%m/%d/%Y")(`7/1/${colorScaleYear}`),
        d3.timeParse("%m/%d/%Y")(`10/1/${colorScaleYear}`),
    ]
    const legendTickScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([0, dimensions.legendWidth])

    const legendValues = legendGroup.selectAll(".legend-value")
        .data(tickValues)
        .join("text")
        .attr("class", "legend-value")
        .attr("x", legendTickScale)
        .attr("y", -6)
        .text(d3.timeFormat("%b"))

    const legendValueTicks = legendGroup.selectAll(".legend-tick")
        .data(tickValues)
        .join("line")
        .attr("class", "legend-tick")
        .attr("x1", legendTickScale)
        .attr("x2", legendTickScale)
        .attr("y1", 6)

    // Set up interactions

    // create voronoi for tooltips
    const delaunay = d3.Delaunay.from(
        dataset,
        d => xScale(xAccessor(d)),
        d => yScale(yAccessor(d)),
    )
    const voronoiPolygons = delaunay.voronoi()
    voronoiPolygons.xmax = dimensions.boundedWidth
    voronoiPolygons.ymax = dimensions.boundedHeight

    const voronoi = dotsGroup.selectAll(".voronoi")
        .data(dataset)
        .join("path")
        .attr("class", "voronoi")
        .attr("d", (d, i) => voronoiPolygons.renderCell(i))

    // add two mouse events in the tooltip

    voronoi.on("mouseenter", onVoronoiMouseEnter)
        .on("mouseleave", onVoronoiMouseLeave)

    const tooltip = d3.select("#tooltip")
    const hoverElementsGroup = bounds.append("g")
        .attr("opacity", 0)

    const dayDot = hoverElementsGroup.append("circle")
        .attr("class", "tooltip-dot")

    function onVoronoiMouseEnter(e, datum) {

        //Given the mouse event and a datum, you are asked to highlight the data by adding an addtioanl circle and display its information (such as date and temperature).

        // To DO

    }

    function onVoronoiMouseLeave() {
        hoverElementsGroup.style("opacity", 0)
        tooltip.style("opacity", 0)
    }

    // add two mouse actions on the legend
    legendGradient.on("mousemove", onLegendMouseMove)
        .on("mouseleave", onLegendMouseLeave)

    const legendHighlightBarWidth = dimensions.legendWidth * 0.05
    const legendHighlightGroup = legendGroup.append("g")
        .attr("opacity", 0)
    const legendHighlightBar = legendHighlightGroup.append("rect")
        .attr("class", "legend-highlight-bar")
        .attr("width", legendHighlightBarWidth)
        .attr("height", dimensions.legendHeight)

    const legendHighlightText = legendHighlightGroup.append("text")
        .attr("class", "legend-highlight-text")
        .attr("x", legendHighlightBarWidth / 2)
        .attr("y", -6)

    function onLegendMouseMove(e) {

        // Display the data only when the data are in the selected date range.

        // To DO

        const isDayWithinRange = d => {
            // Given a datum, judge whether the datum is in a datum range. Return True or False. 
            // To DO
        }


    }

    function onLegendMouseLeave() {
        dotsGroup.selectAll(".dot")
            .transition().duration(500)
            .style("opacity", 1)
            .attr("r", 4)

        legendValues.style("opacity", 1)
        legendValueTicks.style("opacity", 1)
        legendHighlightGroup.style("opacity", 0)
    }

}
drawScatter()
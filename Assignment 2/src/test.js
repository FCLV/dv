async function drawScatter() {

    // 1. Access data

    const dataset = await d3.json("./data/my_weather_data.json")

    // set data constants

    // Get data attributes, i.e. xAccessor for max temperature and yAccessor for min temperature 
    // To DO
    // console.log(dataset)

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
        .range([0, dimensions.boundedWidth]);
    const yScale = d3.scaleLinear()
        .domain([d3.max(dataset, d => d['temperatureMin']), 0])
        .range([0, dimensions.boundedHeight]);
    const colorScale = d3.scaleSequential(d3.interpolateSinebow)
        .domain([946656000000, 978192000000])
        .range([0, 10000000000])
    // console.log(colorScale(colorAccessor(dataset[2])));
    // console.log(colorScale(colorAccessor(dataset[12])));
    // console.log(colorScale(colorAccessor(dataset[20])));
    for (let i in dataset){
        // console.log(dataset[i]['temperatureMax'], dataset[i]['temperatureMin']);
        console.log(colorScale(colorAccessor(dataset[i])))
    }

    // 5. Draw data 
    // draw data into a scatter plot
    // To DO
    bounds.append('g').selectAll('dot')
    .data(dataset)
    .join("circle")
        .attr("cx", function (d) { return xScale(d['temperatureMax']); } )
        .attr("cy", function (d) { return yScale(d['temperatureMin']); } )
        .attr("r", 1.5)
        .style("fill", function (d) {
            return colorScale(colorAccessor(d))
        });

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

}
drawScatter()
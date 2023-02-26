async function drawScatter() {

    // 1. Access data

    const dataset = await d3.json("./data/my_weather_data.json")
    const dateArr = new Array()
    for (i in dataset){
        dateArr.push(dataset[i].date)
    }
    // set data constants

    // Get data attributes, i.e. xAccessor for max temperature and yAccessor for min temperature 
    // To DO
    // console.log(dataset)

    const colorScaleYear = 2000
    const parseDate = d3.timeParse("%Y-%m-%d")
    const colorAccessor = d => parseDate(d.date).setYear(colorScaleYear) / 5e10

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
    maxCol = d3.max(dataset, d => Math.abs(colorAccessor(d)));
    minCol = d3.min(dataset, d => Math.abs(colorAccessor(d)));
    const colorScale = d3.scaleSequential(d3.interpolateRainbow)

    // 5. Draw data 
    // draw data into a scatter plot
    // To DO
    var dotGroup = bounds.append('g').selectAll('circle')
        .data(dataset)
        .join("circle")
        .attr("cx", function(d) { return xScale(d['temperatureMax']); })
        .attr("cy", function(d) { return yScale(d['temperatureMin']); })
        .attr("r", 4)
        .attr("class", 'dot')
        .attr('date', function(d) { return yScale(d['date']); })
        .style("fill", function(d) {
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
        .attr("stop-color", d => d3.interpolateRainbow(d * 0.65))
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
    const tooltip = d3.select("#tooltip");
    const dayDot = d3.select("#tooltip-dot")
        .append('circle')
        .attr('opacity', 0);
    console.log('2')
    var mousemove = function(e, d){
        tooltip.style('opacity', 1)
            .style('left', xScale(d['temperatureMax'])-40 + 'px')
            .style('top', yScale(d['temperatureMin'])+20 + 'px')
            .html('Temp:' + d['temperatureMin'] + '&deg;F - ' + d['temperatureMax'] + '&deg;F<br>Date:' + d['date']);
        
    };
    var mouseleave = function(e, d){
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    };
    
    bounds.selectAll('.dot')
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

    // add two mouse actions on the legend
    legendGradient.on("mousemove", onLegendMouseMove)
        .on("mouseleave", onLegendMouseLeave);

    const legendHighlightBarWidth = dimensions.legendWidth * 0.05
    
    const x_to_legend = d3.scaleLinear()
        .domain([645, 894])
        .range([0, legendGradient.attr('width')-legendHighlightBarWidth]);

    const date_to_legend = d3.scaleLinear()
        .domain([parseDate('2018-01-01').setYear(colorScaleYear), parseDate('2018-12-31').setYear(colorScaleYear)])
        .range([0, legendGradient.attr('width')-legendHighlightBarWidth]);

    const legend_to_365 = d3.scaleLinear()
        .domain([0, legendGradient.attr('width')-legendHighlightBarWidth])
        .range([0, 365]);
    // console.log(date_to_legend(parseDate('2018-12-31').setYear(colorScaleYear)))

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
        .html("here")
    
    function onLegendMouseMove(e) {
        // Display the data only when the data are in the selected date range.
        // To DO
        legendHighlightGroup.style('opacity', 1)
        // for (x in legendHighlightBar){
        //     console.log(x)
        // }
        // console.log(e.x)
        legendHighlightBar.attr('x', x_to_legend(e.x))
        legendHighlightText.attr('x', x_to_legend(e.x+5))
        const leftidx = parseInt(legend_to_365(x_to_legend(e.x)))
        const rightidx = parseInt(legend_to_365(x_to_legend(e.x) + legendHighlightBarWidth))
        legendHighlightText.html(dateArr[leftidx] + ' to ' + dateArr[Math.min(rightidx, 364)])
        
        d3.selectAll('.dot').remove()
        bounds.append('g').selectAll('circle')
            .data(dataset)
            .join("circle")
            .attr("cx", function(d) { return xScale(d['temperatureMax']); })
            .attr("cy", function(d) { return yScale(d['temperatureMin']); })
            .attr("r", function(d) { return isDayWithinRange(d); })
            .style("opacity", function(d) {return isDayWithinRange(d) / 10;})
            .attr("class", 'dot')
            .attr('date', function(d) { return yScale(d['date']); })
            .style("fill", function(d) {
                return colorScale(colorAccessor(d))
            });
        bounds.selectAll('.dot')
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        function isDayWithinRange(d){
            var dateValue =  legend_to_365(date_to_legend(parseDate(d.date).setYear(colorScaleYear)))
            if(dateValue <= rightidx && dateValue >= leftidx){
                return 7;
            }
            else{
                return 2;
            }
        }
    }

    function onLegendMouseLeave() {
        d3.selectAll(".dot")
            // .transition().duration(500)
            .style("opacity", 1)
            .attr("r", 4)

        legendValues.style("opacity", 1)
        legendValueTicks.style("opacity", 1)
        legendHighlightGroup.style("opacity", 0)
    }

}

drawScatter()
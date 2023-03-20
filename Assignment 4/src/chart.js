async function drawChart() {

    // 1. Access data

    const dataset = await d3.json("./data/education.json")

    // get sex variables
    const sexAccessor = d => d.sex
    const sexes = ["female", "male"]
    const sexIds = d3.range(sexes.length)

    // Get education and socioeconomic variables
    // To DO
    const sesAccessor = d => d.sex
    const seses = ["low", "middle", "high"]
    const sesIds = d3.range(seses.length)

    const educationAccessor = d => {
        // let category = [d['<High School'], d['High School'], d['Some Post-secondary'], d['Post-secondary'], d["Associate's"], d["Bachelor's and up"]]
        // let maxIdx = 0,
        //     maxNum = 0
        // for (i in category) {
        //     if (category[i] > maxNum) {
        //         maxIdx = i
        //         maxNum = category[i]
        //     }
        // }
        // return maxIdx
        return [d['<High School'] / 100, d['High School'] / 100, d['Some Post-secondary'] / 100, d['Post-secondary'] / 100, d["Associate's"] / 100, d["Bachelor's and up"] / 100]
    }
    const educationNames = ['<High School', 'High School', 'Some Post-secondary', 'Post-secondary', "Associate's", "Bachelor's and up"]
    const educationIds = d3.range(educationNames.length)
        // End

    const getStatusKey = ({ sex, ses }) => [sex, ses].join("--")


    // Stack Probabilities
    // To DO
    let initArr = []
    for (j in dataset) {
        let temp = {}
        let tempSex = sexAccessor(dataset[j])
        let tempSes = sesAccessor(dataset[j])
            // console.log(tempSex, tempSes)
        let k = [tempSex, tempSes].join("--")
        let v = educationAccessor(dataset[j])
        temp[k] = v
        initArr.push(temp)
    }
    // End


    // Create person
    let currentPersonId = 0

    function generatePerson(elapsed) {
        // To DO
        peopleArr = []
        for (let i = 0; i < elapsed; i++) {
            let Sex = d3.bisect([0, 1], Math.random())
            let Ses = d3.bisect([0, 1], Math.random())
            let Edu = d3.bisect([0.1, 0.2, 0.3, 0.5, 0.8, 1.0], Math.random())
            peopleArr.push({ 'sex': Sex, 'ses': Ses, 'education': Edu })
        }
        return {
            // To DO
            peopleArr,
            yJitter: getRandomNumberInRange(-15, 15), // make people to follow the dots easily
        }
    }


    // 2. Create chart dimensions

    const width = d3.min([
        window.innerWidth * 0.9,
        1200
    ])
    let dimensions = {
        width: width,
        height: 500,
        margin: {
            top: 10,
            right: 200,
            bottom: 10,
            left: 120,
        },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

    // 4. Create scales

    // To DO
    const xScale = d3.scaleLinear()

    const startYScale = d3.scaleLinear()

    const endYScale = d3.scaleLinear()

    const colorScale = d3.scaleLinear()

    // End

    const yTransitionProgressScale = d3.scaleLinear()
        .domain([0.45, 0.55]) // x progress
        .range([0, 1]) // y progress
        .clamp(true)

    // 5. Draw data

    // Define linkGenerator and linkOptions

    // To DO

    const linkLineGenerator = d3.line()


    // End

    const linksGroup = bounds.append("g")
    const links = linksGroup.selectAll(".category-path")
        .data(linkOptions)
        .join("path")
        .attr("class", "category-path")
        .attr("d", linkLineGenerator)
        .attr("stroke-width", dimensions.pathHeight)

    // 6. Draw peripherals

    // start labels
    const startingLabelsGroup = bounds.append("g")
        .style("transform", "translateX(-20px)")

    const startingLabels = startingLabelsGroup.selectAll(".start-label")
        .data(sesIds)
        .join("text")
        .attr("class", "label start-label")
        .attr("y", (d, i) => startYScale(i))
        .text((d, i) => sentenceCase(sesNames[i]))

    const startLabel = startingLabelsGroup.append("text")
        .attr("class", "start-title")
        .attr("y", startYScale(sesIds[sesIds.length - 1]) - 65)
        .text("Socioeconomic")
    const startLabelLineTwo = startingLabelsGroup.append("text")
        .attr("class", "start-title")
        .attr("y", startYScale(sesIds[sesIds.length - 1]) - 50)
        .text("Status")

    // Add the starting bars on the left
    const startingBars = startingLabelsGroup.selectAll(".start-bar")
        .data(sesIds)
        .join("rect")
        .attr("x", 20)
        .attr("y", d => startYScale(d) - (dimensions.pathHeight / 2))
        .attr("width", dimensions.endsBarWidth)
        .attr("height", dimensions.pathHeight)
        .attr("fill", colorScale)


    // end labels
    const endingLabelsGroup = bounds.append("g")
        .style("transform", `translateX(${
        dimensions.boundedWidth + 20
      }px)`)

    const endingLabels = endingLabelsGroup.selectAll(".end-label")
        .data(educationNames)
        .join("text")
        .attr("class", "label end-label")
        .attr("y", (d, i) => endYScale(i) - 15)
        .text(d => d)

    // drawing circle and triangle for male and female, respectively
    const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
        .data(educationIds)
        .join("circle")
        .attr("class", "ending-marker male-marker")
        .attr("r", 5.5)
        .attr("cx", 5)
        .attr("cy", d => endYScale(d) + 5)

    const trianglePoints = [
        "-7,  6",
        " 0, -6",
        " 7,  6",
    ].join(" ")
    const femaleMarkers = endingLabelsGroup.selectAll(".female-marker")
        .data(educationIds)
        .join("polygon")
        .attr("class", "ending-marker female-marker")
        .attr("points", trianglePoints)
        .attr("transform", d => `translate(5, ${endYScale(d) + 20})`)

    const legendGroup = bounds.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${dimensions.boundedWidth}, 5)`)

    const femaleLegend = legendGroup.append("g")
        .attr("transform", `translate(${
        - dimensions.endsBarWidth * 1.5
        + dimensions.endingBarPadding
        + 1
      }, 0)`)
    femaleLegend.append("polygon")
        .attr("points", trianglePoints)
        .attr("transform", "translate(-7, 0)")
    femaleLegend.append("text")
        .attr("class", "legend-text-left")
        .text("Female")
        .attr("x", -20)
    femaleLegend.append("line")
        .attr("class", "legend-line")
        .attr("x1", -dimensions.endsBarWidth / 2 + 1)
        .attr("x2", -dimensions.endsBarWidth / 2 + 1)
        .attr("y1", 12)
        .attr("y2", 37)

    const maleLegend = legendGroup.append("g")
        .attr("transform", `translate(${
        - dimensions.endsBarWidth / 2
        - 4
      }, 0)`)
    maleLegend.append("circle")
        .attr("r", 5.5)
        .attr("transform", "translate(5, 0)")
    maleLegend.append("text")
        .attr("class", "legend-text-right")
        .text("Male")
        .attr("x", 15)
    maleLegend.append("line")
        .attr("class", "legend-line")
        .attr("x1", dimensions.endsBarWidth / 2 - 3)
        .attr("x2", dimensions.endsBarWidth / 2 - 3)
        .attr("y1", 12)
        .attr("y2", 37)


    // 7. Set up interactions


    //people list  will hold all of simulated people 
    //<g> element will hold all of people markers
    const maximumPeople = 10000
    let people = []
    const markersGroup = bounds.append("g")
        .attr("class", "markers-group")
    const endingBarGroup = bounds.append("g")
        .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)


    function updateMarkers(elapsed) {
        const xProgressAccessor = d => (elapsed - d.startTime) / 5000 // a person takes 5 seconds (5000 milliseconds) to cross the chart
        if (people.length < maximumPeople) {
            people = [
                ...people,
                ...d3.range(2).map(() => generatePerson(elapsed)), //pass our elapsed milliseconds to each person as they are created
            ]
        }

        // define females and males respectively  

        // To DO

        const males = markersGroup.selectAll(".marker-circle")

        const females = markersGroup.selectAll(".marker-triangle")

        // End



        const markers = d3.selectAll(".marker")

        markers.style("transform", d => {
                const x = xScale(xProgressAccessor(d))
                const yStart = startYScale(sesAccessor(d))
                const yEnd = endYScale(educationAccessor(d))
                const yChange = yEnd - yStart
                const yProgress = yTransitionProgressScale(
                    xProgressAccessor(d)
                )
                const y = yStart +
                    (yChange * yProgress) +
                    d.yJitter
                return `translate(${ x }px, ${ y }px)`
            })
            .attr("fill", d => colorScale(sesAccessor(d)))
            .transition().duration(100)
            .style("opacity", d => xScale(xProgressAccessor(d)) < 10 ?
                0 :
                1
            )

        const endingGroups = educationIds.map(endId => (
            people.filter(d => (
                xProgressAccessor(d) >= 1 &&
                educationAccessor(d) == endId
            ))
        ))
        const endingPercentages = d3.merge(
            endingGroups.map((peopleWithSameEnding, endingId) => (
                d3.merge(
                    sexIds.map(sexId => (
                        sesIds.map(sesId => {
                            const peopleInBar = peopleWithSameEnding.filter(d => (
                                sexAccessor(d) == sexId
                            ))
                            const countInBar = peopleInBar.length
                            const peopleInBarWithSameStart = peopleInBar.filter(d => (
                                sesAccessor(d) == sesId
                            ))
                            const count = peopleInBarWithSameStart.length
                            const numberOfPeopleAbove = peopleInBar.filter(d => (
                                sesAccessor(d) > sesId
                            )).length

                            return {
                                endingId,
                                sesId,
                                sexId,
                                count,
                                countInBar,
                                percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                                percent: count / (countInBar || 1),
                            }
                        })
                    ))
                )
            ))
        )

        endingBarGroup.selectAll(".ending-bar")
            .data(endingPercentages)
            .join("rect")
            .attr("class", "ending-bar")
            .attr("x", d => -dimensions.endsBarWidth * (d.sexId + 1) -
                (d.sexId * dimensions.endingBarPadding)
            )
            .attr("width", dimensions.endsBarWidth)
            .attr("y", d => endYScale(d.endingId) -
                dimensions.pathHeight / 2 +
                dimensions.pathHeight * d.percentAbove
            )
            .attr("height", d => d.countInBar ?
                dimensions.pathHeight * d.percent :
                dimensions.pathHeight
            )
            .attr("fill", d => d.countInBar ?
                colorScale(d.sesId) :
                "#dadadd"
            )

        // Update number

        // To DO
        endingLabelsGroup.selectAll(".ending-value")

        // End

    }

    d3.timer(updateMarkers)
}


drawChart()


// utility functions

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

const sentenceCase = str => [
    str.slice(0, 1).toUpperCase(),
    str.slice(1),
].join("")
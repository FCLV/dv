async function drawChart() {

    // 1. Access data

    const dataset = await d3.json("./data/education.json")

    // get sex variables
    const sexAccessor = d => d.sex
    const sexes = ["female", "male"]
    const sexIds = d3.range(sexes.length)

    // Get education and socioeconomic variables
    // To DO
    const sesAccessor = d => d.ses
    const seses = ["low", "middle", "high"]
    const sesIds = d3.range(seses.length)
    const educationAccessor = d => {
        return [d['<High School'] / 100, d['High School'] / 100, d['Some Post-secondary'] / 100, d['Post-secondary'] / 100, d["Associate's"] / 100, d["Bachelor's and up"] / 100]
    }
    const educationNames = ['<High School', 'High School', 'Some Post-secondary', 'Post-secondary', "Associate's", "Bachelor's and up"]
    const educationIds = d3.range(educationNames.length)
        // End

    const getStatusKey = ({ sex, ses }) => [sex, ses].join("--")
    let d = dataset[4]
    let category = [d['<High School'], d['High School'], d['Some Post-secondary'], d['Post-secondary'], d["Associate's"], d["Bachelor's and up"]]
    let maxIdx = 0,
        maxNum = 0
    for (i in category) {
        if (category[i] > maxNum) {
            maxIdx = i
            maxNum = category[i]
        }
    }
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

    function generatePerson(elapsed) {
        // To DO
        peopleArr = []
        for (let i = 0; i < elapsed; i++) {
            let Sex = d3.bisect([0, 1], Math.random())
            let Ses = d3.bisect([0, 1], Math.random())
            let Edu = d3.bisect([0.1, 0.2, 0.3, 0.5, 0.8, 1.0], Math.random())
                // console.log(Sex, Ses, Edu)
            peopleArr.push({ 'sex': Sex, 'ses': Ses, 'education': Edu })
        }
        return {
            // To DO
            peopleArr,
            yJitter: getRandomNumberInRange(-15, 15), // make people to follow the dots easily
        }
    }
}

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

drawChart()
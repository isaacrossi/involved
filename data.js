const apiHost = "api-football-v1.p.rapidapi.com/v3"
const apiKey = "ed258403cfmsh30f5a085abc2d2ep1858afjsnf5d899d5c50c"

// fetching a response from api-football.
const getStats = function () {

    return fetch(`https://api-football-v1.p.rapidapi.com/v3/players/topscorers?season=2021&league=39`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": apiHost,
            "x-rapidapi-key":  apiKey
        }
    })

    // getting the total goals, shots, name, and photo from the fetch request
    .then(response => response.json()) 
    .then( data => {
        return data.response.map(response => {
            response.statistics.map(statistic => {
                data = {
                    goals: statistic.goals.total,
                    minutes: statistic.games.minutes,
                    apps: statistic.games.appearences,
                    shots: statistic.shots.total,
                    on: statistic.shots.on,
                    pens: statistic.penalty.scored,
                    name: response.player.name,
                    photo: response.player.photo,
                    id: response.player.id
                } 
                   
            })

            return data

        })
        
    })
   
}

// select all of the select boxes
const selectTags = document.querySelectorAll("select") 

// grab the svg tag from index.html
const svg = d3.select("svg")

// apply a width and height to the svg
svg
    .attr("width", "960")
    .attr("height", "720")

// making a group for the axis so we can use it and update it when we place the players
const axisXGroup =  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate (0, 620)")

const axisYGroup =  svg
    .append("g")
    .attr("class", "y-axis") 
    .attr("transform", "translate(100, 0)")

// creating a text element within the svg for the x-axis
const axisXText = svg 
    .append("text")
    .attr("class", "x-axis")
    .attr("transform", "translate(480, 670)")
    .text("Number of minutes played")

// creating a text element within the svg for the y-axis    
const axisYText = svg 
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(30, 360) rotate(-90)")
    .text("Total number of goals")

 
const loadPlayers = function (data) {

    let inputX = document.querySelector("select[name=valueX]")
    let inputY = document.querySelector("select[name=valueY]")

    let valueX = inputX.value
    let valueY = inputY.value

    //getting the max and min values to scale the data properly
        
    let maxValueX = d3.max(data, (d, i) => { return d[valueX] })
    let maxValueY = d3.max(data, (d, i) => { return d[valueY] })

    // creating our scales so the circles are displayed correctly on the data viz
    const scaleX = d3.scaleLinear()
        .domain([0, maxValueX])
        .range([100, 860])

    const scaleY = d3.scaleLinear()
        .domain([0, maxValueY])
        .range([620, 100])

    //creating our x axis and attaching our scale
    const axisX = d3.axisBottom(scaleX)
    
    // creating our y axis and attaching our scale
    const axisY = d3.axisLeft(scaleY)
    
    // this attaches our x axis to our axisXGroup
    axisXGroup.call(axisX)

    // this attaches our y axis to our axisYGroup
    axisYGroup.call(axisY)

    // creating players groups within our svg whose positions are decided by the
    // data given back from the API
    const players = svg
        .selectAll("g.players")
        .data(data, (d, i) => { return d.name})
        .enter()
        .append("g")
        .attr("class", "players")
        .attr("transform", (d, i) => {
            const x = scaleX(d[valueX])
            const y = scaleY(d[valueY])
            return `translate(${x}, ${y})`
            })
    

    // to display the players photo in the circle we needed to create a pattern and image
    // within a defs tag (this is what svgs expect)
    const defs = players
        .append("defs")

    defs
        .selectAll("patterns")
        .data(data)   
        .enter() 
        .append("pattern")
        .attr("width", 40)
        .attr("height", 40)
        .attr("id", (d, i) => {return `image-${d.id}`})
        .append("image")
        .attr("class", "player-image")
        .attr("xlink:href", (d, i) => { return d.photo })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", 50)

    players
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .attr("class", "player-circle")
        .transition()
        .attr("r", 25)       
        .style("fill", (d, i) => {return `url(#image-${d.id}`})

    // this makes the player groups reposition themselves when we change the input value
    // for any data thats already been added above
    svg
        .selectAll("g.players")
        .transition()
        .duration(750)
        .attr("transform", (d, i) => {
            const x = scaleX(d[valueX])
            const y = scaleY(d[valueY])
            return `translate(${x}, ${y})`
        })              

       
    // here we  create the rectangle that shows on hover
    players
        .append("rect")
        .attr("x", -60)
        .attr("y", -60)
        .attr("width", 120)
        .attr("height", 30)
        
    // this is the text that shows in the rectangle
    players
        .append("text")
        .attr("x", 0)
        .attr("y", -39)
        .text((d,i) => { return d.name})  
        
        // raise the player circles when we hover over them
    svg
        .selectAll("g.players")
        .on("mouseover", function () {
            d3.select(this).raise()
         }) 

}

// populating data when the page loads
getStats()
    .then(data => {
        loadPlayers(data)
    })

// populate data when we change our input
selectTags.forEach((selectTag) => {
    selectTag.addEventListener("change", function () {
        getStats()
            .then(data => {
                loadPlayers(data)
        })
    })
})

 












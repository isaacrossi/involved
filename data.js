const apiHost = "api-football-v1.p.rapidapi.com/v3"
const apiKey = "ed258403cfmsh30f5a085abc2d2ep1858afjsnf5d899d5c50c"

// grab the svg tag from index.html
const svg = d3.select("svg")

// apply a width and height to the svg
svg
    .attr("width", "960")
    .attr("height", "720")

// creating a text element within the svg for the x-axis
    const axisXText = svg 
    .append("text")
    .attr("class", "x-axis")
    .attr("transform", "translate(480, 670)")
    .text("x-axis")

// creating a text element within the svg for the y-axis    
const axisYText = svg 
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(30, 360) rotate(-90)")
    .text("y-axis")    


// fetching a response from api-football.
const getStats = function () {

    let valueX = "goals"
    let valueY = "apps"

    const scaleX = d3.scaleLinear()
        .domain([0, 20])
        .range([100, 860])

    const scaleY = d3.scaleLinear()
        .domain([0, 20])
        .range([620, 100])
    

    return fetch(`https://api-football-v1.p.rapidapi.com/v3/players/topscorers?season=2021&league=39`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": apiHost,
            "x-rapidapi-key":  apiKey
        }
    })

    // getting the total goals and appearences from the fetch request
    .then(response => response.json()) 
    .then( data => {
        return data.response.map(response => {
            data = response.statistics.map( statistic => {
                return {
                    goals: statistic.goals.total,
                    apps: statistic.games.appearences,
                    name: response.player.name,
                    photo: response.player.photo
                }
            })

            console.log(data)

            // creating players groups within our svg whose positions are decided by the
            // data given back from the API
            const players = svg 
                .selectAll("g.players")
                .data(data, (d, i) => { return d.name})
                .enter()
                .append("g")
                .attr("class", "players")
                .attr("transform", (d, i) => {
                    const x = scaleX(d.goals)
                    const y = scaleY(d.apps)
                    return `translate(${x}, ${y})`
                })

            // creating a circle element within the players group for the visualisation
            players
                .append("image")
                .attr("class", "photo")
                .attr("xlink:href", (d, i) => {return `${d.photo}`})
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "50")
                .attr("height", "50")
                
        })
        
    })

}

getStats()


 












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
    .text("Number of minutes played")

// creating a text element within the svg for the y-axis    
const axisYText = svg 
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(30, 360) rotate(-90)")
    .text("Total number of goals")    


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
            data = response.statistics.map(statistic => {
                return {
                    goals: statistic.goals.total,
                    minutes: statistic.games.minutes,
                    name: response.player.name,
                    photo: response.player.photo,
                    id: response.player.id
                }
            })
            

            let valueX = "minutes"
            let valueY = "goals"
            
            
            // getting the max and min values to scale the data properly
            let maxValueX = d3.max(data, (d, i) => { return d[valueX] })
            let maxValueY = d3.max(data, (d, i) => { return d[valueY] })

            

    // creating our scales so the circles are displayed correctly on the data viz
            const scaleX = d3.scaleLinear()
                .domain([0, 500])
                .range([100, 860])

            const scaleY = d3.scaleLinear()
                .domain([0, 20])
                .range([620, 100])
    

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
                
        })
        
    })

}

// running the function when the page loads
getStats()



 












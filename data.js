const apiHost = "api-football-v1.p.rapidapi.com/v3"
const apiKey = "ed258403cfmsh30f5a085abc2d2ep1858afjsnf5d899d5c50c"

const getStats = function (playerId) {
    return fetch(`https://api-football-v1.p.rapidapi.com/v3/players?id=${playerId}&season=2021`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": apiHost,
            "x-rapidapi-key":  apiKey
        }
    })

    // getting the total goals and appearences from the fetch request
    .then(response => response.json()) 
    .then(data => {
        return data.response.map(response => {
            data = response.statistics.map( statistic => {
                return {
                    goals: statistic.goals.total,
                    apps: statistic.games.appearences,
                } 
                
            })
            
        })
        
    })

}








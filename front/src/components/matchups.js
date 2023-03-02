import React, {useEffect, useState} from 'react'

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    const [statID, setStatID] = useState()
    useEffect(() => {
        if(data){
            let relevantData = data[1]['scoreboard'][0]['matchups']
            let statIDData = data[2]['stat_categories'] 
            setStatID(statIDData)
            setMatchupData(relevantData)
        }
    },[data])

    function generateMatchups(){
        let availableData = matchupData ? matchupData : {}
        let dataKeys = Object.keys(availableData)
        dataKeys.map((key) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']
                let statData = singleMatchupData['stat_winners']

                console.log(team1, team2)
            }
        })
    }

    return(
        <div>
        {generateMatchups()}
        </div>
    )
}
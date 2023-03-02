import React, {useEffect, useState} from 'react'

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    const [statID, setStatID] = useState()
    useEffect(() => {
        if(data){
            console.log(data)
            // let relevantData = data[1]['scoreboard'][0]['matchups']
            // console.log(relevantData)
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
                let statData = singleMatchupData['stat_winners'] 
                console.log(teamsData)
            }
        })
    }

    return(
        <div>
        {generateMatchups()}
        </div>
    )
}
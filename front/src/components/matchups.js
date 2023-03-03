import React, {useEffect, useState} from 'react'
import matchupStyles from '../styles/matchup.module.sass'

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

    // function generateMatchups(){
    //     let availableData = matchupData ? matchupData : {}
    //     let dataKeys = Object.keys(availableData)
    //     return dataKeys.map((key) => {
    //         if(key !== 'count'){
    //             let singleMatchupData = availableData[key].matchup
    //             let teamsData = singleMatchupData[0].teams
    //             let team1 = teamsData[0]['team']
    //             let team2 = teamsData[1]['team']
    //             let statData = singleMatchupData['stat_winners']

    //             console.log(team1)
    //             return (
    //                 <div className={matchupStyles.matchupContainer}>
    //                     <p>{team1[0][2]['name']}</p>
    //                     <p>vs</p>
    //                     <p>{team2[0][2]['name']}</p>
    //                 </div>
    //             )
    //         }
    //     })
    // }

    function generateList(){
        let availableData = matchupData ? matchupData : {}
        let dataKeys = Object.keys(availableData)
        return dataKeys.map((key) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']
                let statData = singleMatchupData['stat_winners']

                return (
                    <div className={matchupStyles.listRow}>
                        <p>{team1[0][2]['name']}</p>
                        <p>vs</p>
                        <p>{team2[0][2]['name']}</p>
                    </div>
                )
            }
        })

    }

    return(
        <div className={matchupStyles.matchupWrapper}>
            <div className={matchupStyles.listWrapper}>
                <p>Matchup list</p>
                {matchupData && generateList()}
            </div>
            <div className={matchupStyles.individualWrapper}>
                <p>Individual Matchups</p>
            </div>
        </div>
    )
}
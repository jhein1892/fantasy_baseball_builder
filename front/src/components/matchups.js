import React, {useEffect, useState} from 'react'
import matchupStyles from '../styles/matchup.module.sass'
import classNames from 'classnames';

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    const [statID, setStatID] = useState()
    const [currentMatchup, setCurrentMatchup] = useState(0)
    useEffect(() => {
        if(data){
            let relevantData = data[1]['scoreboard'][0]['matchups']
            let statIDData = data[2]['stat_categories'] 
            setStatID(statIDData)
            setMatchupData(relevantData)
        }
    },[data])

    function generateList(){
        let availableData = matchupData ? matchupData : {}
        let dataKeys = Object.keys(availableData)
        return dataKeys.map((key) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']

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

    function generateCard(){
        let availableData = matchupData ? matchupData : {}
        let dataKeys = Object.keys(availableData)
        return dataKeys.map((key) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']
                let statData = singleMatchupData['stat_winners']

                const matchupClas = classNames(matchupStyles.matchupContainer, {
                    [matchupStyles.display]:currentMatchup == key, 
                })
                

                return (
                    <div className={matchupClas}>
                        <p>{team1[0][2]['name']}</p>
                        <p>vs</p>
                        <p>{team2[0][2]['name']}</p>
                    </div>
                )
            }
        })
    }

    function handleCardChange(e){
        e.preventDefault();
        let direction = e.target.name
        // let currentValue = currentMatchup
        let maxCount = matchupData.count
        if(direction === 'next'){
            if(currentMatchup == maxCount-1){
                setCurrentMatchup(0)
            } else {
                setCurrentMatchup(currentMatchup+1)
            }
        } else {
            if(currentMatchup === 0){
                // console.log('here', typeof maxCount)
                setCurrentMatchup(maxCount - 1)
            } else {
                setCurrentMatchup(currentMatchup-1)
            }
        }
        console.log(currentMatchup)
        console.log(e.target.name)
    }

    return(
        <div className={matchupStyles.matchupWrapper}>
            <div className={matchupStyles.listWrapper}>
                <p>Matchup list</p>
                {matchupData && generateList()}
            </div>
            <div className={matchupStyles.individualWrapper}>
                <button name='back' onClick={handleCardChange}>Back</button>
                <div>
                    {matchupData && generateCard()}
                </div>
                <button name='next' onClick={handleCardChange}>Next</button>
            </div>
        </div>
    )
}
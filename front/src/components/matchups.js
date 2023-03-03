import React, {useEffect, useState} from 'react'
import matchupStyles from '../styles/matchup.module.sass'
import classNames from 'classnames';

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    const [statID, setStatID] = useState([])
    const [currentMatchup, setCurrentMatchup] = useState(0)
    useEffect(() => {
        if(data){
            let relevantData = data[1]['scoreboard'][0]['matchups']
            let statIDData = data[2]['stat_categories'] 
            setStatID(statIDData)
            console.log(statIDData)
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

                const listClass = classNames(matchupStyles.listRow, {
                    [matchupStyles.active]:currentMatchup == key, 
                })

                return (
                    <div className={listClass}>
                        <p>{team1[0][2]['name']}</p>
                        <p>vs</p>
                        <p>{team2[0][2]['name']}</p>
                    </div>
                )
            }
        })
    }


    function generateTeam(team){
        let imageURL = team[0][5]['team_logos'][0]['team_logo']['url']
        // console.log(team)
        return (
            <div className={matchupStyles.teamWrapper}>
                <div className={matchupStyles.imageWrapper}>
                    <img src={imageURL} alt={`${team[0][2]['name']}_logo`}/>
                </div>
                <h3>{team[0][2]['name']}</h3>
            </div>
        )

    }

    function generateStats(key){
        let statData = matchupData[key].matchup['stat_winners']
        console.log(statData)
        return statData.map((category) => {
            let stat_id = category['stat_winner']['stat_id']
            let displayName = statID.find(el => el.stat_id == stat_id)
            let dataType = displayName['position_types'][0]
            displayName = displayName['display_name']

            console.log(dataType)
            if(dataType == 'B'){
                return (
                    <p>{displayName}</p>
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

                const matchupClass = classNames(matchupStyles.matchupContainer, {
                    [matchupStyles.display]:currentMatchup == key, 
                })

                return (
                    <div className={matchupClass}>
                        <div>
                            {generateTeam(team1)}
                        </div>
                        <div>
                            <h2>vs</h2>
                            {generateStats(key)}
                        </div>
                        <div>
                            {generateTeam(team2)}
                        </div>
                    </div>
                )
            }
        })
    }



    function handleCardChange(e){
        e.preventDefault();
        let direction = e.target.name
        let maxCount = matchupData.count
        if(direction === 'next'){
            if(currentMatchup == maxCount-1){
                setCurrentMatchup(0)
            } else {
                setCurrentMatchup(currentMatchup+1)
            }
        } else {
            if(currentMatchup === 0){
                setCurrentMatchup(maxCount - 1)
            } else {
                setCurrentMatchup(currentMatchup-1)
            }
        }
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
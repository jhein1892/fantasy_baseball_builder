import React, {useEffect, useState} from 'react'
import matchupStyles from '../styles/matchup.module.sass'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'


// Once we get live Data, will need to work on showing whose winning categories

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    const [statID, setStatID] = useState([])
    const [currentMatchup, setCurrentMatchup] = useState(0)
    const [displayStats, setDisplayStats] = useState('B')

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
        return dataKeys.map((key,index) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']

                const listClass = classNames(matchupStyles.listRow, {
                    [matchupStyles.active]:currentMatchup == key, 
                })

                return (
                    <div key={`${key}-${index}`} className={listClass}>
                        <p>{team1[0][2]['name']}</p>
                        <p>vs</p>
                        <p>{team2[0][2]['name']}</p>
                    </div>
                )
            }
        })
    }


    function generateTeam(team, key){
        let imageURL = team[0][5]['team_logos'][0]['team_logo']['url']
        // console.log(team)
        return (
            <div className={matchupStyles.thirdContainer}>
                <div className={matchupStyles.topSection}>
                    <div className={matchupStyles.imageWrapper}>
                        <img src={imageURL} alt={`${team[0][2]['name']}_logo`}/>
                    </div>
                    <h3>{team[0][2]['name']}</h3>
                    <h2 className={matchupStyles.teamPoints}>{team[1]['team_points']['total']}</h2>
                </div>
                {generateStats(key, team)}
            </div>
        )

    }

    function generateStats(key, team=null){
        let statData = matchupData[key].matchup['stat_winners']
        return statData.map((category,index) => {
            let stat_id = category['stat_winner']['stat_id']
            let winner_id = category['stat_winner']['winner_team_key']
            let displayName = statID.find(el => el.stat_id == stat_id)
            let dataType = displayName['position_types'][0]
            displayName = displayName['display_name']
            let stat_value = category['stat_winner']
            
            let team_id;
            let team_stats;
            let cat_player_value = -1;

            if(team){
                team_id = team[0][0]['team_key']
                team_stats = team[1]['team_stats']['stats']
                team_stats.map((stat) => {
                    if(stat['stat']['stat_id'] == stat_id){
                        cat_player_value = stat['stat']['value']
                        return true
                    }
                    
                })
            }

            const statClass = classNames({
                [matchupStyles.statTied]: !team && stat_value['is_tied'] == 1,
                [matchupStyles.statWinning]: team && (winner_id === team_id)
            })

            if(dataType == displayStats){
                return (
                    <p key={`${displayName}-${index}`} className={statClass}>{cat_player_value !== -1 ? cat_player_value : displayName}</p>
                )
            }
        })
    }

    function generateCard(){
        let availableData = matchupData ? matchupData : {}
        let dataKeys = Object.keys(availableData)
        return dataKeys.map((key, index) => {
            if(key !== 'count'){
                let singleMatchupData = availableData[key].matchup
                let teamsData = singleMatchupData[0].teams
                let team1 = teamsData[0]['team']
                let team2 = teamsData[1]['team']
                console.log(team1)

                const matchupClass = classNames(matchupStyles.matchupContainer, {
                    [matchupStyles.display]:currentMatchup == key, 
                })


                const buttonClass = (name) => classNames(matchupStyles.tabButtons, {
                    [matchupStyles.activeTab]: displayStats == name,
                    [matchupStyles.pitchingTab]: name == 'P',
                    [matchupStyles.battingTab]: name == 'B'
                })

                return (
                    <div key={`${key}-keys-${index}`} className={matchupClass}>
                        <div style={{width: '100%'}}>
                            {generateTeam(team1, key)}
                        </div>
                        <div className={matchupStyles.thirdContainer}>
                            <div className={matchupStyles.topSection}>
                                <h3>vs</h3>
                                <div className={matchupStyles.buttonContainer}>
                                    <button className={buttonClass('P')} name='P' onClick={() => {setDisplayStats('P');}}>Pitching</button>
                                    {/* <hr /> */}
                                    <button className={buttonClass('B')} name='B' onClick={() => {setDisplayStats('B');}}>Batting</button>
                                </div>

                            </div>
                            {generateStats(key)}                            
                        </div>
                        <div style={{width: '100%'}}>
                            {generateTeam(team2, key)}
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
                <button name='back' onClick={handleCardChange}><FontAwesomeIcon color='#5d5d87' size='4x' icon={faChevronCircleLeft}/></button>
                <div>
                    {matchupData && generateCard()}
                </div>
                <button name='next' onClick={handleCardChange}><FontAwesomeIcon color='#5d5d87' size='4x' icon={faChevronCircleRight}/></button>
            </div>
        </div>
    )
}
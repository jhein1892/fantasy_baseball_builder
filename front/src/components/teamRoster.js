import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.module.sass';
import classNames from 'classnames';
import axios from 'axios';
import config from '../config';

export default function TeamRoster({ data, categories, weeklyStats }){
    const [localData, setLocalData] = useState();
    const [updatedRoster, setUpdatedRoster] = useState([]);
    const [weeklyData, setWeeklyData]= useState({});
    const [displayStats, setDisplayStats] = useState('season')


    const batterPositions = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util', 'Util'];    // Roster Positions for Batters 
    const pitcherPositions = ['SP','SP','SP','RP','RP','P','P','P'];                // Roster Positions for Pitchers
    const additionalPositions = ['BN','BN','BN','IL','IL','IL','IL','NA'];          // Additonal Roster Spots
    const availablePositions = {
        "C": 1,
        "1B": 1, 
        "2B": 1,
        "3B": 1,
        "SS": 1,
        "OF": 3,
        "Util": 1,
        "SP": 3,
        "RP": 2,
        "P": 3,
        "BN": 4,
        "IL": 4,
        "NA": 1
    }

    const [error, setError] = useState({
        batterLineup: false, 
        pitcherLineup: false
    })

    function handleSubmit(e){
        e.preventDefault();

        axios.put(`${config.REACT_APP_API_ENDPOINT}/updateRoster`, updatedRoster)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    function handleDrop(e){
        e.preventDefault();
        let playerRow = e.target.parentNode.parentNode
        let playerId = playerRow.id

        axios.put(`${config.REACT_APP_API_ENDPOINT}/dropPlayer`, {id:playerId})
        .then((response) => {
            console.log(response)
        })
        
        
    }

    function handlePositionChange(e, type){
        setError(prev => ({...prev, ['batterLineup']: false, ['pitcherLineup']: false}))
        let id = e.target.name;
        let value = e.target.value;
        let tempLocalData = localData;
        let moveAllowed = true;
        let positionType = type === 'P' ? 'pitcherLineup' : 'batterLineup';
        console.log(id)

        if(availablePositions[value] === 1){
            if(tempLocalData.some(player => player['selected_position'] === value)){
                moveAllowed = false;
            }
        } else if (availablePositions[value] > 1){
            let playersInPosition = tempLocalData.filter((player) => player.selected_position === value);
            if(playersInPosition.length === availablePositions[value]){
                moveAllowed = false; 
            } 
        }

        if(moveAllowed){

            let changeInfo = {'player_id': id, 'selected_position': value}
            let hasChanged = false
            let changes = updatedRoster
            // console.log(changes)
            for (let i = 0; i < changes.length; i++){
                if(changes[i]['player_id'] == id){
                    changes[i] = changeInfo;
                    hasChanged = true;
                }
            }
            if(!hasChanged){
                changes.push(changeInfo);
            }
            setUpdatedRoster([...changes])

            tempLocalData.every((player) => {
                if(player.player_id == id){
                    player.selected_position = value;
                    return false;
                }
                return true;
            })
            setLocalData([...tempLocalData]);
        } else setError(prev => ({...prev, [positionType] : value}));
    }

    function generateCategories(type, isHeader, data=null){
        if(categories){
            let cats = categories.filter((x) => x.position_type == type)
            return cats.map((x,index) => {
                if(isHeader){
                    return (
                        <th key={`header-${x['display_name']}-${index}`}>{x.display_name}</th>
                    )
                }
                else {
                    let category = data[x['display_name']]
                
                    return (
                        <td key={`body-${x['display_name']}-${index}`}>{category ? category.value : "-"}</td>
                    )
                }
            })
        }

    }

    function generatePositions(positionSet, type){
        let tempData = localData ?  localData.filter((x) => x.position_type === type) : [];
        positionSet = positionSet.concat(additionalPositions)
        if(tempData.length > 0){
            return positionSet.map((position, index) => {

                // Find players assigned to current positions
                let eligiblePlayer = tempData.filter((x) => x.selected_position === position);
                let weeklyData;
                // Pick first element and remove from data set for future positions.
                if(eligiblePlayer.length > 0){
                    eligiblePlayer = eligiblePlayer[0];
                    let newTempData = tempData.filter((x) => x.player_id !== eligiblePlayer.player_id);
                    weeklyData = weeklyStats[eligiblePlayer.player_id]
                    // console.log("weeklyData: ", weeklyData)
                    tempData = newTempData;
                } 
                else {
                    eligiblePlayer = {}
                }

                if(additionalPositions.includes(position) && !eligiblePlayer['player_id']) {
                    return null;
                }
                // Eligible positions for position players
                let eligible_positions = eligiblePlayer.eligible_positions ? eligiblePlayer.eligible_positions.concat(['BN', 'IL', 'NA']) : [];
                let statObject = {}

                // Building dict that will hold the values/names for stats
                if(eligiblePlayer && eligiblePlayer['player_stats']){
                    let player_stats = displayStats === 'season' ? eligiblePlayer['player_stats']['stats'] : weeklyData;
                    // console.log(player_stats)
                    player_stats.forEach((stat) => {
                        if (displayStats === 'season') {
                            stat = stat['stat']
                        }

                        if(stat['stat_id'] == '50'){ // Innings Pitched
                            let value = stat['value']
                            if(value === '-'){
                                value = '0.0'
                            }
                            statObject['IP'] = {stat: '50',  value: value}
                        }

                        if(stat['stat_id'] == '60'){ // H/AB (AVG)
                            let value = stat['value'] 
                            value = value.split('/')
                            value = parseFloat(value[0]/value[1]).toFixed(3)
                            if(value === 'NaN'){
                                value = '0.000'
                            }
                            value = value.substring(1)
                            statObject['BA'] = {stat:'60', value: value}
                        }
                        let displayName
                        if (displayStats === 'season'){
                            let name = categories.filter((x) => x.stat_id == stat.stat_id)
                            name = name[0]
                            displayName = name ? name['display_name'] : 'NA'
                        } else {
                            displayName = stat['stat_name']
                        }
                        statObject[displayName] = stat

                    })
                }

                console.log(statObject)

                let additionalProperty = type === 'B' ? statObject['BA'] : statObject['IP']

                // else return table row with data
                return(
                    <tr className={rosterStyles.positionSlot} key={`${position}-${index}`} id={eligiblePlayer.player_id}>
                        <td className={rosterStyles.positionTitle}>{position}</td>
                        {eligiblePlayer && 
                        <>
                        <td className={rosterStyles.playerName}>{eligiblePlayer.status && <span className={rosterStyles.injuryTag}>{eligiblePlayer.status}</span>}{eligiblePlayer.name ? eligiblePlayer.name['full'] : 'empty' } - <span>{eligiblePlayer.display_position}</span></td>
                        <td>{additionalProperty ? additionalProperty['value'] : 0}</td>
                        {generateCategories(type, false, statObject)}
                        <td>
                            <select
                                name={eligiblePlayer.player_id}
                                onChange={(e) => handlePositionChange(e, type)}
                                value={eligiblePlayer.selected_position}
                            >
                                {eligiblePlayer.eligible_positions ?
                                    <>
                                    <option
                                        key={`${eligiblePlayer.player_id}-${eligiblePlayer.selected_position}-a`}
                                        value={eligiblePlayer.selected_position}
                                    >
                                        {eligiblePlayer.selected_position}
                                    </option>
    
                                    {eligible_positions.map((position, index) => {
                                        let thisposition = position.position ? position.position : position
                                        if(thisposition === eligiblePlayer.selected_position) return;
                                        return (
                                            <option
                                                value={thisposition}
                                                key={`${eligiblePlayer.player_id}-${thisposition}-${index}`}
                                            >
                                                {thisposition}
                                            </option>
                                        )
                                    })}
                                    </>
                                    :
                                    <option></option>
                                }
                            </select>
                        </td>
                        <td><button onClick={handleDrop}>Drop</button></td>
                        </>
                        }
                    </tr>
                )
            })
        }
    }

    useEffect(() => {
        if(data){
            setLocalData(data)
            setWeeklyData(weeklyStats)
            // console.log(weeklyStats)
            // console.log(data)
        }
    },[data])

    // Some styles that are based off of states
    const batterErrorClasses = classNames(rosterStyles.errorWrapper, {
        [rosterStyles.errorEnabled]:error.batterLineup
    });
    
    const pitcherErrorClasses = classNames(rosterStyles.errorWrapper, {
        [rosterStyles.errorEnabled]:error.pitcherLineup
    });

    return (
        <div className={rosterStyles.rosterWrapper}>
            <button onClick={() => {setDisplayStats('season')}}>Season</button>
            <button onClick={() => {setDisplayStats('week')}}>This Week</button>
            <h3>Batters:</h3>
            <div className={batterErrorClasses}>
                {error.batterLineup &&
                    <p>Error Player already in position: {error.batterLineup}</p>
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Name</th>
                        <th>BA</th>
                        {generateCategories('B', true)}
                        <th>Switch Positions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {localData && generatePositions(batterPositions, 'B')}
                </tbody>
            </table>
            <h3>Pitchers:</h3>
            <div className={pitcherErrorClasses}>
                {error.pitcherLineup &&
                    <p>Error Player already in position: {error.pitcherLineup}</p>
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Name</th>
                        <th>IP</th>
                        {generateCategories('P', true)}
                        <th>Switch Positions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {localData && generatePositions(pitcherPositions, 'P')}
                </tbody>
            </table>
            <div className={rosterStyles.buttonWrapper}>
                <button type='submit' onClick={handleSubmit}>Submit</button>
                <button className={rosterStyles.calibrateButton}>Calibrate Team</button>
            </div>
        </div>
    )
}



// Batters Stat Categories:	Runs (R), Hits (H), Home Runs (HR), Runs Batted In (RBI), Stolen Bases (SB), Walks (BB), Intentional Walks (IBB), Hit By Pitch (HBP), On-base + Slugging Percentage (OPS), Catcher Interference (CI)
// Pitchers Stat Categories:	Wins (W), Losses (L), Complete Games (CG), Strikeouts (K), Balks (BLK), Batters Grounded Into Double Plays (GIDP), Earned Run Average (ERA), (Walks + Hits)/ Innings Pitched (WHIP), Pickoffs (PICK), Saves + Holds (SV+H) 
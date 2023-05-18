import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.module.sass';
import classNames from 'classnames';
import axios from 'axios';
import config from '../config';

export default function TeamRoster({ data, categories, weeklyStats, league_avg }){
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
        // console.log(id)

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
            let cats = Object.values(categories).filter((x) => x.position_type == type)
            let calc_perc = null;
            if (data){
                if(type === 'B'){
                    calc_perc = parseFloat(data['PA']['value'])
                }
                if(type === 'P'){
                    // 180IP standardized
                    calc_perc = data['IP'] ?  parseFloat(data['IP']['value'])/180 : null;
                }
            }
            return cats.map((x,index) => {
                if(isHeader){
                    return (
                        <th key={`header-${x['display_name']}-${index}`}>{x.display_name === 'H/AB' ? 'AVG' : x.display_name}</th>
                        )
                    }
                    else {
                    let perc_dev = null;
                    let isPos = true;
                    let category = data[x['display_name']]
                    if(type === 'B'){
                        if(league_avg[type][x['display_name']] != null && calc_perc != null){    
                            let std_dev;
                            if(!['OPS', 'H/AB'].includes(x['display_name'])){
                                let standardized_val = league_avg[type][x['display_name']] * calc_perc
                                std_dev = category.value / standardized_val
                            } else {
                                std_dev = category.value / league_avg[type][x['display_name']] 
                            }
                            
                            if (std_dev < 1){
                                isPos = false;
                            }
                            perc_dev = Math.abs(1 - std_dev) * 100
                        }
                    } if(type === 'P'){
                        if (calc_perc != null){
                            let std_dev;
                            let standardized_val;

                            if (['ERA', 'WHIP'].includes(x['display_name'])){
                                std_dev = category.value / league_avg[type][x['display_name']]
                                if (std_dev > 1){
                                    isPos = false;
                                }
                            } 
                            else {
                                standardized_val = league_avg[type][x['display_name']] * calc_perc;
                                std_dev = category.value / standardized_val;
                                // If blk or l and more than average, or not blk or l and less than average
                                if ((['BLK','L'].includes(x['display_name']) && std_dev > 1) || !['BLK','L'].includes(x['display_name']) && std_dev < 1){
                                    isPos = false;
                                }
                            }                            
                            perc_dev = Math.abs(1 - std_dev) * 100
                        }
                    }
                    const statClass = classNames({
                        [rosterStyles.avg]: perc_dev <= 5 || !perc_dev,
                        [rosterStyles.sm_pos] : isPos && (perc_dev <=30 && perc_dev > 5),
                        [rosterStyles.md_pos] : isPos && (perc_dev > 30 && perc_dev <= 60),
                        [rosterStyles.lg_pos] : isPos && perc_dev > 60,
                        [rosterStyles.sm_neg] : !isPos && (perc_dev <=30 && perc_dev > 5),
                        [rosterStyles.md_neg] : !isPos && (perc_dev > 30 && perc_dev <= 60) ,
                        [rosterStyles.lg_neg] : !isPos && perc_dev > 60,
                    });
                
                    return (
                        <td className={statClass} key={`body-${x['display_name']}-${index}`}>{category ? category.value : "-"}</td>
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
                    player_stats.forEach((stat) => {
                        if (displayStats === 'season') {
                            stat = stat['stat']
                        }

                        let displayName
                        if (displayStats === 'season'){
                            let name = categories[stat.stat_id].display_name                            
                            displayName = name ? name : 'NA'
                        } else {
                            displayName = stat['stat_name']
                        }
                        if(stat['stat_id'] == '60'){ // Transform H/AB to AVG
                            let value = stat['value'] 
                            value = value.split('/')
                            value = parseFloat(value[0]/value[1]).toFixed(3)
                            if(value === 'NaN'){
                                value = '0.000'
                            }
                            value = value.substring(1)
                            statObject['H/AB'] = {stat:'60', value: value}
                        } else {
                            statObject[displayName] = stat
                        }

                    })
                }

                // else return table row with data
                return(
                    <tr className={rosterStyles.positionSlot} key={`${position}-${index}`} id={eligiblePlayer.player_id}>
                        <td className={rosterStyles.positionTitle}>{position}</td>
                        {eligiblePlayer && 
                        <>
                        <td className={rosterStyles.playerName}>{eligiblePlayer.status && <span className={rosterStyles.injuryTag}>{eligiblePlayer.status}</span>}{eligiblePlayer.name ? eligiblePlayer.name['full'] : 'empty' } - <span>{eligiblePlayer.display_position}</span></td>
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
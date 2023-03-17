import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.module.sass';
import classNames from 'classnames';
import axios from 'axios';
import config from '../config';

// Add Drop button

export default function TeamRoster({ data, categories }){
    const [localData, setLocalData] = useState();
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

        console.log(localData);
        axios.put(`${config.REACT_APP_API_ENDPOINT}/updateRoster`, localData)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    function handlePositionChange(e, type){
        setError(prev => ({...prev, ['batterLineup']: false, ['pitcherLineup']: false}))
        let id = e.target.name;
        let value = e.target.value;
        let tempLocalData = localData;
        let moveAllowed = true;
        let positionType = type === 'P' ? 'pitcherLineup' : 'batterLineup';

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

    function generatePositions(positionSet, type){
        let tempData = localData ?  localData.filter((x) => x.position_type === type) : [];
        positionSet = positionSet.concat(additionalPositions)
        if(tempData.length > 0){
            return positionSet.map((position, index) => {
    
                // Find players assigned to current positions
                let eligiblePlayer = tempData.filter((x) => x.selected_position === position);
    
                // Pick first element and remove from data set for future positions.
                if(eligiblePlayer.length > 0){
                    eligiblePlayer = eligiblePlayer[0];
                    let newTempData = tempData.filter((x) => x.player_id !== eligiblePlayer.player_id);
                    tempData = newTempData;
                }
    
                if(additionalPositions.includes(position) && eligiblePlayer.length === 0) {
                    return null;
                }
                // Eligible positions for position players
                let eligible_positions = eligiblePlayer.eligible_positions ? eligiblePlayer.eligible_positions.concat(['BN', 'IL', 'NA']) : [];
                eligiblePlayer['player_stats']['stats'].forEach((stat) => {
                    let name = categories.filter((x) => x.stat_id == stat.stat.stat_id)
                    name = name[0]
                    console.log(name ? name['display_name']: 'NA')
                    stat['stat']['display_name'] = name ? name['display_name']: 'NA'
                })
                console.log(eligiblePlayer)
                
                // else return table row with data
                return(
                    <tr className={rosterStyles.positionSlot} key={`${position}-${index}`}>
                        <td className={rosterStyles.positionTitle}>{position}</td>
                        <td className={rosterStyles.playerName}>{eligiblePlayer.name ? eligiblePlayer.name['full'] : 'empty' } - <span>{eligiblePlayer.display_position}</span></td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
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
                    </tr>
                )
            })
        }
    }

    useEffect(() => {
        if(data){
            setLocalData(data)
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
                        <th>R</th>
                        <th>H</th>
                        <th>HR</th>
                        <th>RBI</th>
                        <th>SB</th>
                        <th>BB</th>
                        <th>IBB</th>
                        <th>HBP</th>
                        <th>OPS</th>
                        <th>CI</th>
                        <th>Switch Positions</th>
                    </tr>
                </thead>
                <tbody>
                    {generatePositions(batterPositions, 'B')}
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
                        <th>(W)</th>
                        <th>(L)</th>
                        <th>(CG)</th>
                        <th>(K)</th>
                        <th>(BLK)</th>
                        <th>(GIDP)</th>
                        <th>(ERA)</th>
                        <th>(WHIP)</th>
                        <th>(PICK)</th>
                        <th>(SV+H)</th>
                        <th>Switch Positions</th>
                    </tr>
                </thead>
                <tbody>
                    {generatePositions(pitcherPositions, 'P')}
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
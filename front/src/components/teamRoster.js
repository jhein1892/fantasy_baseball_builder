import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.module.sass'


// import styles from '../styles/teamRoster.modules.css';

export default function TeamRoster({data, setData}){
    const [localData, setLocalData] = useState();
    const batterPositions = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util'];    // Roster Positions for Batters 
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
        "BN": 3,
        "IL": 4,
        "NA": 1
    }

    const [error, setError] = useState({
        batterLineup: false, 
        pitcherLineup: false
    })

    function handlePositionChange(e){
        let id = e.target.name;
        let value = e.target.value;
        let tempLocalData = localData;
        // let moveAllowed = true;
        // When we are dealing with bench positions, we should allow as many players as we want to be placed on the bench, but there should be an error that shows up saying that there are too many players on the bench and we don't have a complete lineup.


        // Check if there is already a player at that position

        if(availablePositions[value] === 1){
            // If the availablePositions[value] === 1, then if the position already exists throw error.
            if(tempLocalData.some(player => player['selected_position'] === value)){
                console.log('error!')
            } else {
                console.log('not error')
            }
        } else if (availablePositions[value] > 1){
            // If the availablePositions[value] > 1, then if the length of the filter is already the availablePositions[value] throw error. 
            let playersInPosition = tempLocalData.filter((player) => player.selected_position === value);
            if(playersInPosition.length === availablePositions[value]){
                console.log('error!')
            } else {
                console.log('not error')
            }
        }












        // if(!additionalPositions.includes(value) && tempLocalData.some(player => player['selected_position'] === value)){
        //     // Set my error state to true
        //     setError(prev => ({...prev, ['batterLineup'] : true}))
            
        //     // update the class for this row to show an error.
            
            
            
        // } else { // If there is no player in the position
        //     setError(prev => ({...prev, ['batterLineup'] : false}))
        //     tempLocalData.every((player) => {
        //         if(player.player_id == id){
        //             player.selected_position = value;
        //             return false;
        //         }
        //         return true;
        //     })
        //     setLocalData([...tempLocalData]);
        // }
    }

    function generatePositions(positionSet, type){
        let tempData = localData ?  localData.filter((x) => x.position_type === type) : [];
        positionSet = positionSet.concat(additionalPositions)
        console.log(tempData)
        return positionSet.map((position, index) => {
            // Find players assigned to current positions
            let eligiblePlayer = tempData.filter((x) => x.selected_position === position);
            let eligiblePositionsString = "";

            // Pick first element and remove from data set for future positions.
            if(eligiblePlayer.length > 0){
                eligiblePlayer = eligiblePlayer[0];
                let newTempData = tempData.filter((x) => x.player_id !== eligiblePlayer.player_id);
                tempData = newTempData;

                for(let i = 0; i < eligiblePlayer.eligible_positions.length; i++){
                    let position = eligiblePlayer.eligible_positions[i]
                    if(i === 0){
                        eligiblePositionsString += position + ""
                    } else {
                        eligiblePositionsString += ", " + position
                        
                    }
                }
            }

            if(additionalPositions.includes(position) && eligiblePlayer.length === 0) {
                return null;
            }
            // Eligible positions for position players
            let eligible_positions;
            if(type === 'P')
                eligible_positions = eligiblePlayer.eligible_positions ? eligiblePlayer.eligible_positions.concat(['P','BN', 'IL', 'NA']) : [];
            else if(type === 'B') 
                eligible_positions = eligiblePlayer.eligible_positions ? eligiblePlayer.eligible_positions.concat(['Util','BN', 'IL', 'NA']) : [];
            // else return table row with data
            return(
                <tr className={rosterStyles.positionSlot} key={`${position}-${index}`}>
                    <td className={rosterStyles.positionTitle}>{position}</td>
                    <td className={rosterStyles.playerName}>{eligiblePlayer.name ? eligiblePlayer.name : 'empty' } - <span>{eligiblePositionsString}</span></td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>14</td>
                    <td>
                        <select
                            name={eligiblePlayer.player_id}
                            onChange={handlePositionChange}
                        >
                            {eligiblePlayer.eligible_positions ?
                                <>
                                <option
                                    key={`${eligiblePlayer.player_id}-${eligiblePlayer.selected_position}`}
                                    value={eligiblePlayer.selected_position}
                                >
                                    {eligiblePlayer.selected_position}
                                </option>

                                {eligible_positions.map((position) => {
                                    if(position === eligiblePlayer.selected_position) return;
                                    return (
                                        <option
                                            value={position}
                                            key={`${eligiblePlayer.player_id}-${position}`}
                                        >
                                            {position}
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

    useEffect(() => {
        if(data.length > 0){
            setLocalData(data)
        }
    },[data])

    useEffect(() => {
        console.log('local data changed', localData)
    }, [localData])

    return (
        <div className={rosterStyles.rosterWrapper}>
            <h3>Batters:</h3>
            <div>
                {error.batterLineup &&
                    <p>Error Player already in position</p>
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
                <button type='submit'>Submit</button>
                <button className={rosterStyles.calibrateButton}>Calibrate Team</button>
            </div>
        </div>
    )
}



// Batters Stat Categories:	Runs (R), Hits (H), Home Runs (HR), Runs Batted In (RBI), Stolen Bases (SB), Walks (BB), Intentional Walks (IBB), Hit By Pitch (HBP), On-base + Slugging Percentage (OPS), Catcher Interference (CI)
// Pitchers Stat Categories:	Wins (W), Losses (L), Complete Games (CG), Strikeouts (K), Balks (BLK), Batters Grounded Into Double Plays (GIDP), Earned Run Average (ERA), (Walks + Hits)/ Innings Pitched (WHIP), Pickoffs (PICK), Saves + Holds (SV+H)
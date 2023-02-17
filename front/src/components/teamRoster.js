import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.module.sass'


// import styles from '../styles/teamRoster.modules.css';

export default function TeamRoster({data, setData}){
    const batterPositions = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util'];    // Roster Positions for Batters 
    const pitcherPositions = ['SP','SP','SP','RP','RP','P','P','P'];                // Roster Positions for Pitchers
    const additionalPositions = ['BN','BN','BN','IL','IL','IL','IL','NA'];          // Additonal Roster Spots

    function generatePositions(positionSet, type){
        let tempData = data ?  data.filter((x) => x.position_type === type) : [];
        positionSet = positionSet.concat(additionalPositions)

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

            // If there are no players to fill additional position return no row
            // if(additionalPositions.includes(position) && eligiblePlayer.length === 0){
            //     return;
            // }

            if(additionalPositions.includes(position) && eligiblePlayer.length === 0) {
                return null;
            }


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
                        <select>
                            <option>1B</option> 
                        </select>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className={rosterStyles.rosterWrapper}>
            <h3>Batters:</h3>
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
                        <th>Secondary Positions</th>
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
                        <th>Secondary Positions</th>
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
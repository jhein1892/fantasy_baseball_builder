import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.modules.css'

export default function TeamRoster({data, setData}){
    const batterPositions = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util'];    // Roster Positions for Batters 
    const pitcherPositions = ['SP','SP','SP','RP','RP','P','P','P'];                // Roster Positions for Pitchers
    const additionalPositions = ['BN','BN','BN','IL','IL','IL','IL','NA'];          // Additonal Roster Spots

    function generatePositions(positionSet){
        let tempData = data
        return positionSet.map((position, index) => {
            let elegiblePlayer = tempData.filter((x) => x.selected_position === position);
            let eligiblePositionsString = "";

            if(elegiblePlayer.length > 0){
                elegiblePlayer = elegiblePlayer[0];
                let newTempData = tempData.filter((x) => x.player_id !== elegiblePlayer.player_id);
                tempData = newTempData;

                for(let i = 0; i < elegiblePlayer.eligible_positions.length; i++){
                    let position = elegiblePlayer.eligible_positions[i]
                    if(i === 0){
                        eligiblePositionsString += position + ""
                    } else {
                        eligiblePositionsString += ", " + position
                        
                    }
                }

                // for(let position of elegiblePlayer.eligible_positions){
                //     console.log(position)

                
                // }
            }
            console.log(elegiblePlayer)

            // 2) Figure out how I'm going to deal with bench players
            return(
                <tr className='positionSlot' key={`${position}-${index}`}>
                    <td className='positionTitle'>{position}</td>
                    <td className='playerName'>{elegiblePlayer.name ? elegiblePlayer.name : 'empty' } - <span>{eligiblePositionsString}</span></td>
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
        <div className='rosterWrapper'>
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
                    {generatePositions(batterPositions)}
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
                    {generatePositions(pitcherPositions)}
                </tbody>
            </table>
            <h3>Bench/IL:</h3>
            {/* {generatePositions(additionalPositions)} */}
        </div>
    )
}



// Batters Stat Categories:	Runs (R), Hits (H), Home Runs (HR), Runs Batted In (RBI), Stolen Bases (SB), Walks (BB), Intentional Walks (IBB), Hit By Pitch (HBP), On-base + Slugging Percentage (OPS), Catcher Interference (CI)
// Pitchers Stat Categories:	Wins (W), Losses (L), Complete Games (CG), Strikeouts (K), Balks (BLK), Batters Grounded Into Double Plays (GIDP), Earned Run Average (ERA), (Walks + Hits)/ Innings Pitched (WHIP), Pickoffs (PICK), Saves + Holds (SV+H)
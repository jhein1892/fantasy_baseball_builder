import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.modules.css'

export default function TeamRoster({data, setData}){
    const batterPositions = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util'];    // Roster Positions for Batters 
    const pitcherPositions = ['SP','SP','SP','RP','RP','P','P','P'];                // Roster Positions for Pitchers
    const additionalPositions = ['BN','BN','BN','IL','IL','IL','IL','NA'];          // Additonal Roster Spots

    function generatePositions(positionSet){
        let tempData = data
        return positionSet.map((position, index) => {
            let elegibleBatter = tempData.filter((x) => x.selected_position === position);

            if(elegibleBatter.length > 0){
                elegibleBatter = elegibleBatter[0];
                let newTempData = tempData.filter((x) => x.player_id !== elegibleBatter.player_id);
                tempData = newTempData;
            }
            return(
                <div className='positionSlot' key={`${position}-${index}`}>
                    <p className='positionTitle'>{position}</p>
                    <p className='playerName'>{elegibleBatter.name ? elegibleBatter.name : 'empty' }</p>
                </div>
            )
        })
    }

    return (
        <div className='rosterWrapper'>
            <h3>Batters:</h3>
            {generatePositions(batterPositions)}
            <h3>Pitchers:</h3>
            {generatePositions(pitcherPositions)}
            <h3>Bench/IL:</h3>
            {generatePositions(additionalPositions)}
        </div>
    )
}



// Batters Stat Categories:	Runs (R), Hits (H), Home Runs (HR), Runs Batted In (RBI), Stolen Bases (SB), Walks (BB), Intentional Walks (IBB), Hit By Pitch (HBP), On-base + Slugging Percentage (OPS), Catcher Interference (CI)
// Pitchers Stat Categories:	Wins (W), Losses (L), Complete Games (CG), Strikeouts (K), Balks (BLK), Batters Grounded Into Double Plays (GIDP), Earned Run Average (ERA), (Walks + Hits)/ Innings Pitched (WHIP), Pickoffs (PICK), Saves + Holds (SV+H)
import React, { useEffect, useState } from 'react'
import rosterStyles from '../styles/teamRoster.modules.css'

export default function TeamRoster({id, data, setData}){
    const positionsToBeFilled = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util','SP','SP','SP','RP','RP','P','P','P','BN','BN','BN','IL','IL','IL','IL','NA']

    function generateRosterPositions(){
            let tempData = data;
            return positionsToBeFilled.map((position, index) => {
                let elegiblePlayer = tempData.filter((x) => x.selected_position === position);
                if(elegiblePlayer.length > 0)
                {
                    console.log(position, ":", elegiblePlayer);

                }
                if(elegiblePlayer.length > 0){
                    elegiblePlayer = elegiblePlayer[0];
                    let newTempData = tempData.filter((x) => x.name !== elegiblePlayer.name);
                    tempData = newTempData
                }

                return (
                    <div className='positionSlot' key={`${position}-${index}`}>
                        <p>{position}</p>
                        <p>{elegiblePlayer ? elegiblePlayer.name : '' }</p>
                    </div>
                )

                
            })
    }

    return (
        <div className='rosterWrapper'>
            {generateRosterPositions()}
        </div>
    )
}
import React, { useEffect } from 'react'
import rosterStyles from '../styles/teamRoster.modules.css'

export default function TeamRoster({data}){
    const positionsToBeFilled = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util','SP','SP','SP','RP','RP','P','P','P','BN','BN','BN','IL','IL','IL','IL','NA']
    function generateRosterPositions(){
            return positionsToBeFilled.map((position, index) => {
                let elegiblePlayer = data.filter((x) => x.selected_position === position);
                console.log(position, ":", elegiblePlayer, index);
                if(elegiblePlayer.length === 1){
                    elegiblePlayer = elegiblePlayer[0];
                } else {
                    // Needs to get fixed
                    elegiblePlayer = elegiblePlayer[0];
                }
                return (
                    <div className='positionSlot' >
                        <p>{position}</p>
                        <p>{elegiblePlayer ? elegiblePlayer.name : '' }</p>
                    </div>
                )
            })
    }

    useEffect(() => {
        console.log('data in teamRoster', data)
    }, [data])

    return (
        <div className='rosterWrapper'>
            {generateRosterPositions()}
        </div>
    )
}
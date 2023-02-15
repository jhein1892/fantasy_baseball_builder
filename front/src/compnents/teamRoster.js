import React, { useEffect } from 'react'
import rosterStyles from '../styles/teamRoster.modules.css'

export default function TeamRoster({data}){
    const positionsToBeFilled = ['C', '1B', '2B', '3B', 'SS','OF','OF','OF','Util','SP','SP','SP','RP','RP','P','P','P','BN','BN','BN','IL','IL','IL','IL','NA']
    function generateRosterPositions(){
            return positionsToBeFilled.map((position) => {
                return (
                    <div className='positionSlot'>
                        <p>{position}</p>
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
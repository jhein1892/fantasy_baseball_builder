import React, { useEffect } from 'react';
import bodyStyles from '../styles/body.module.sass';
import TeamRoster from './teamRoster';

export default function Body({userInfo, rosterData}) {
    
    useEffect(() => {
        // Will be a main route, used to generate all of the data being passed down to these components
    },[])

    return (
        <div className={bodyStyles.bodyWrapper} onScroll={() => console.log('scrolling')}>
            <div className={bodyStyles.rosterSection}>
                <TeamRoster data={rosterData} 
                // setData={setRosterData} 
                />
            </div>
            <div className={bodyStyles.leagueSection}>
                <p>League Standing</p>
            </div>
            <div className={bodyStyles.freeAgentSection}>
                <p>Free Agents/Waivers</p>
            </div>
            <div className={bodyStyles.matchupSection}>
                <p>This Weeks matchups</p>
            </div>
            <div className={bodyStyles.tradeSection}>
                <p>Proposed Trades</p>
            </div>
        </div>
    )
}
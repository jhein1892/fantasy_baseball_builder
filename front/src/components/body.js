import React, { useEffect } from 'react';
import bodyStyles from '../styles/body.module.sass';
import TeamRoster from './teamRoster';
import Standings from './standings';

export default function Body({userInfo, data}) {
    
    useEffect(() => {
        if(data)
            console.log(data)
        // Will be a main route, used to generate all of the data being passed down to these components
    },[data])

    return (
        <div className={bodyStyles.bodyWrapper} onScroll={() => console.log('scrolling')}>
            <div className={bodyStyles.rosterSection}>
                <TeamRoster data={data.roster}/>
            </div>
            <div className={bodyStyles.leagueSection}>
                <Standings data={data.standings}/>
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
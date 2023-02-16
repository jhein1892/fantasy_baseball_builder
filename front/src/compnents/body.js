import React, { useEffect } from 'react';
import '../styles/body.modules.css';
import TeamRoster from './teamRoster';

export default function Body({userInfo, rosterData, setRosterData}) {
    
    useEffect(() => {
        // Will be a main route, used to generate all of the data being passed down to these components
    },[])

    return (
        <div className='bodyWrapper'>
            <div className='rosterSection'>
                <TeamRoster data={rosterData} setData={setRosterData} />
            </div>
            <div className='leagueSection'>
                <p>League Standing</p>
            </div>
            <div className='freeAgentSection'>
                <p>Free Agents/Waivers</p>
            </div>
            <div className='matchupSection'>
                <p>This Weeks matchups</p>
            </div>
            <div className='tradeSection'>
                <p>Proposed Trades</p>
            </div>
        </div>
    )
}
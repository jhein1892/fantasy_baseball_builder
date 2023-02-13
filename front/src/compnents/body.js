import React from 'react';
import '../styles/body.modules.css';

export default function Body({userInfo})
{
    return (
        <div className='wrapper'>
            <div>
                <p>My Team Roster</p>
                <p>League_ID: {userInfo.league_id ? userInfo.league_id : "" }</p>
                <p>Team Name: {userInfo.team_name ? userInfo.team_name : "" }</p>
            </div>
            <div>
                <p>League Standing</p>
            </div>
            <div>
                <p>Free Agents/Waivers</p>
            </div>
            <div>
                <p>This Weeks matchups</p>
            </div>
            <div>
                <p>Proposed Trades</p>
            </div>
        </div>
    )
}
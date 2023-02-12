import React from 'react';
import '../styles/body.modules.css';

export default function Body({userInfo})
{
    return (
        <div className='wrapper'>
            <h1>Main Section of the App</h1>
            <p>I'm going to have various functions here in order to set up the functionality to pass to the backend.</p>
            <hr/>
            <p>{userInfo.league_id ? userInfo.league_id : "" }</p>
            <hr/>
            <p>League_id (This will need to be an input)</p>
            <p>Team name</p>
            <p>Create a section to see which players are on waivers. Maybe see which ones would be value adds for your team</p>
            <p>Create section to see Free Agents</p>
            <p>Create section to show matchup for current week</p>
            <p>See section that has proposed trades</p>
            <p>Section for the teams roster</p>
            <p>Section for standings</p>

        </div>
    )
}
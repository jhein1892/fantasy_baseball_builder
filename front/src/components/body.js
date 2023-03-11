import React, { useEffect, useState } from 'react';
import bodyStyles from '../styles/body.module.sass';

import TeamRoster from './teamRoster';
import Standings from './standings';
import Matchups from './matchups';
import FreeAgents from './freeAgents';
import CompareModal from './compareModal';

export default function Body({userInfo, data}) {
    const [player1Info, setPlayer1Info] = useState()
    const [player2Info, setPlayer2Info] = useState()
    const [viewComparison, setViewComparison] = useState(false)

    function generateComparison(player1, player2 = data.roster){
        setPlayer1Info(player1)
        setPlayer2Info(player2)
        setViewComparison(true)
    }
    // function handleClick(e){
    //     e.preventDefault()
    //     if(e.target.id === 'outer'){
    //         setViewComparison(false)
    //     }
    // }
    return (
        <div className={bodyStyles.bodyWrapper} onScroll={() => console.log('scrolling')}>
            <div className={bodyStyles.rosterSection}>
                <TeamRoster data={data.roster}/>
            </div>
            <div className={bodyStyles.leagueSection}>
                <Standings data={data.standings}/>
            </div>
            <div className={bodyStyles.freeAgentSection}>
                {/* <p>Free Agents/Waivers</p> */}
                <FreeAgents generateComparison={generateComparison}/>
            </div>
            <div className={bodyStyles.matchupSection}>
                <Matchups data={data.matchups}/>
            </div>
            <div className={bodyStyles.tradeSection}>
                <p>Proposed Trades</p>
            </div>
            {viewComparison &&
                <CompareModal player1={player1Info} player2={player2Info} setViewComparison={setViewComparison}/>
            }
        </div>
    )
}
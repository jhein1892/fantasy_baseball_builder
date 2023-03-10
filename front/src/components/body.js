import React, { useEffect, useState } from 'react';
import bodyStyles from '../styles/body.module.sass';
import modalStyles from '../styles/modal.module.sass';
import TeamRoster from './teamRoster';
import Standings from './standings';
import Matchups from './matchups';
import FreeAgents from './freeAgents';

export default function Body({userInfo, data}) {
    const [player1Info, setPlayer1Info] = useState()
    const [player2Info, setPlayer2Info] = useState()
    const [viewComparison, setViewComparison] = useState(false)

    function generateComparison(player1, player2 = data.roster){
        console.log(player1)
        console.log(player2)
        setViewComparison(true)
    }
    function handleClick(e){
        e.preventDefault()
        if(e.target.id === 'outer'){
            setViewComparison(false)
        }
    }
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
                <div id='outer' onClick={(e) => {handleClick(e)}} className={modalStyles.wrapper}>
                    <div className={modalStyles.innerWrapper}>
                        <div><p>Player 1</p></div>
                        <hr/>
                        <div><p>Player 2</p></div>
                    </div>
                </div>
            }
        </div>
    )
}
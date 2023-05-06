import React, { useEffect, useState } from 'react';
import bodyStyles from '../styles/body.module.sass';

import TeamRoster from './teamRoster';
import Standings from './standings';
import Matchups from './matchups';
import FreeAgents from './freeAgents';
import CompareModal from './compareModal';
import Trades from './trades';

export default function Body({data, weeklyStats}) {
    const [player1Info, setPlayer1Info] = useState()
    const [player2Info, setPlayer2Info] = useState()
    const [viewComparison, setViewComparison] = useState(false)

    function generateComparison(player1, player2 = data.roster){
        setPlayer1Info(player1)
        setPlayer2Info(player2)
        setViewComparison(true)
    }

    useEffect(() => {
        if(Object.keys(data).length > 0){
            let categories = data.categories
            let ids = data.stat_map
            
            Object.keys(ids).map((id) => {
                let details = categories.filter((x) => x.display_name == ids[id])
                ids[id] = details.length > 0 ? details[0] : ids[id];
            })

        }
    },[data])

    return (
        <div className={bodyStyles.bodyWrapper} onScroll={() => console.log('scrolling')}>
            <div className={bodyStyles.rosterSection}>
                <TeamRoster data={data.roster} categories={data.categories} weeklyStats={weeklyStats}/>
            </div>
            <div className={bodyStyles.leagueSection}>
                <Standings data={data.standings}/>
            </div>
            <div className={bodyStyles.freeAgentSection}>
                <FreeAgents generateComparison={generateComparison}/>
            </div>
            <div className={bodyStyles.matchupSection}>
                <Matchups data={data.matchups} categories={data.stat_map}/>
            </div>
            <div className={bodyStyles.tradeSection}>
                <Trades categories={data.categories}/>
            </div>
            {viewComparison &&
                <CompareModal player1={player1Info} player2={player2Info} setViewComparison={setViewComparison} categories={data.categories}/>
            }
        </div>
    )
}
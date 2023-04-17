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
            let ids = data.stat_ids.stat_categories

            function findID(name, type){
                let info = ids.filter((id) => {if(id.display_name == name && id.position_types[0] == type){
                    return id
                }})
                return info
            }            
            
            categories.forEach((x) => {
                let type = x.position_type
                let id = findID(x.display_name, type)
                id = id[0]
                x['stat_id'] = id.stat_id
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
                <Matchups data={data.matchups} categories={data.categories}/>
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
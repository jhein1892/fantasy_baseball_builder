import React, { useEffect } from 'react';
import standingsStyles from '../styles/leagueStandings.module.sass';

export default function Standings({data}){

    useEffect(() => {
        if(data){
            console.log(data)
        }
    },[data])

    function generateLeagueStandings(){
        
        data = data ? data.sort((x, y) => x.rank - y.rank): [];
        return data.map((team) => {
            let outcomes = team.outcome_totals
            let record = `${outcomes.wins}-${outcomes.losses}-${outcomes.ties}`
            return(
                <tr>
                    <td>{team.rank}</td>
                    <td>{team.name}</td>
                    <td>{record}</td>
                    <td>{outcomes.percentage}</td>
                    <td>{team.games_back}</td>
                </tr>
            )
        })
    }

    return (
        <div className={standingsStyles.standingsWrapper}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Record</th>
                        <th>Win %</th>
                        <th>Games Back</th>
                    </tr>
                </thead>
                <tbody>
                    {generateLeagueStandings()}
                </tbody>
            </table>
        </div>
    )
}
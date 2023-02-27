import React, { useEffect } from 'react'

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
        <div>
            <h1>Standings</h1>
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
import React, { useEffect } from 'react'

export default function Standings({data}){

    useEffect(() => {
        if(data){
            console.log(data)
        }
    },[data])

    function generateLeagueStandings(){
        data = data.sort((x, y) => x.rank - y.rank);
        return data.map((team) => {
            return(
                <p>{team.name}</p>
            )
        })
    }

    return (
        <div>
            <h1>Standings</h1>
            <div>
                {data ? 
                    generateLeagueStandings()
                    :
                    <h3>standings</h3>
                }
            </div>
        </div>
    )
}
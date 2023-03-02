import React, {useEffect, useState} from 'react'

export default function Matchups({data}){
    const [matchupData, setMatchupData] = useState()
    useEffect(() => {
        if(data){
            let relevantData = data[1].scoreboard[0].matchups
            setMatchupData(relevantData)
        }
    },[data])

    function generateMatchups(){
        
        console.log(matchupData)
    }

    return(
        <div>
        {generateMatchups()}
        </div>
    )
}
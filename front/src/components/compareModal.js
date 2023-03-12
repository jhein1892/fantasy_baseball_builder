import React, {useEffect, useState} from 'react'
import modalStyles from '../styles/modal.module.sass';

export default function CompareModal({player1, player2, setViewComparison, categories}){
    const [statCategories, setStatCategories] = useState()

    useEffect(() => {
        let type = player1.playerInfo[0].position_type
        let relevantCategories = categories.filter((x) => x.position_type === type)
        setStatCategories(relevantCategories)
        // console.log("Categories: ", relevantCategories, type)
    },[])

    function generatePlayer(player){
        // console.log("Categories: ", categories)
        // console.log("ID's: ", stat_ids)
        // console.log("Player Details: ", player)
        
        let info = player.playerInfo[0]
        let playerDetails = player.playerDetails[0]
        let positions = info.eligible_positions.join(', ')
        return(
            <>
                <div className={modalStyles.playerInfo}>
                    <img src={playerDetails.image_url} alt='player_headshot' />
                    <h2>{info.name} - <span>{positions}</span></h2>
                    <p>Injury Status: {info.status ? info.status: "None"}</p>
                    <p>Percent Owned:{info.percent_owned}</p>
                </div>
                <div className={modalStyles.scoringStats}>

                </div> 
                <div className={modalStyles.altStats}>

                </div>
            </>
        )

        console.log(player)
    }

    function handleClick(e){
        e.preventDefault()
        if(e.target.id === 'outer'){
            setViewComparison(false)
        }
    }
    return(
        <div id='outer' onClick={(e) => {handleClick(e)}} className={modalStyles.wrapper}>
            <div className={modalStyles.innerWrapper}>
                <div className={modalStyles.playerWrapper}>
                    {generatePlayer(player1)}
                </div>
                <hr/>
                <div><p>Player 2</p></div>
            </div>
        </div>
    )
}
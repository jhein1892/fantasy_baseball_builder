import React from 'react'
import modalStyles from '../styles/modal.module.sass';

export default function CompareModal({player1, player2, setViewComparison}){

    function generatePlayer(player){
        let info = player.playerInfo[0]
        let stats = player.stats
        let positions = info.eligible_positions.join(', ')
        return(
            <>
                <div className={modalStyles.playerInfo}>
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
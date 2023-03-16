import React, {useEffect, useState} from 'react'
import modalStyles from '../styles/modal.module.sass';

export default function CompareModal({player1, player2, setViewComparison, categories}){
    const [statCategories, setStatCategories] = useState()
    const [currentPlayer, setCurrentPlayer] = useState()

    useEffect(() => {
        console.log("player1", player1)
        console.log("player2", player2)
        try{
            let type = player1.position_type
            let relevantCategories = categories.filter((x) => x.position_type === type)
            let displayPlayer = player2.filter((x) => x.selected_position == player1.primary_position)
            setCurrentPlayer(displayPlayer[0])
            setStatCategories(relevantCategories)
        } catch(error) {
            console.log('not ready yet')
        }
    },[player1])

    function generatePlayer(player){
        // let info = player.playerInfo[0]
        // let playerDetails = player.playerDetails[0]
        // let positions = info.eligible_positions.join(', ')

        function generateStats(){

            return statCategories.map((stat) => {
                let playerStats = player.player_stats.stats.filter((x) => x.stat.stat_id == stat.stat_id)
                playerStats = playerStats[0]
                
                return (
                    <div className={modalStyles.statWrapper}>
                        <p className={modalStyles.statName}>{stat.display_name}</p>
                        {/* <hr /> */}
                        <p className={modalStyles.statValue}>{playerStats.stat.value}</p>
                    </div>
                )
            })
        }

        return(
            <>
                <div className={modalStyles.playerInfo}>
                    <img src={player.image_url} alt='player_headshot' />
                    <h2>{player.name.full} - <span>{player.display_position}</span></h2>
                </div>
                <div className={modalStyles.scoringStats}>
                    {statCategories && generateStats()}
                </div> 
                <div className={modalStyles.altStats}>
                    {player.selected_position && 
                        <button>Remove</button>
                    } 
                    {!player.selected_position &&

                        <button>Add</button>
                    }
                </div>
            </>
        )
    }

    function handleChange(e){
        e.preventDefault()
        let selectedPlayer = e.target.options[e.target.selectedIndex]
        let newPlayer = player2.filter((x) => x.player_id == selectedPlayer.id)
        setCurrentPlayer(newPlayer[0])
    }
    function AvailablePlayers(){
        let positions = player1.position_type
        let swappable = player2.filter((x) => x['position_type'] == positions)

        return (
            <div className={modalStyles.selectWrapper}>
                <select
                    defaultValue={player1.primary_position}
                    onChange={(e) => handleChange(e)}
                >
                    {swappable.map((player) => {

                        return(
                            <option value={player.selected_position} id={player.player_id} key={`option-${player.selected_position}-${player.player_id}`}>
                                <p>{player.name['full']} - <span>{player.selected_position}</span></p>
                            </option>
                        )
                    })}
                </select>
            </div>
        )
    }

    function handleClick(e){
        e.preventDefault()
        if(e.target.id === 'outer'){
            setStatCategories()
            setCurrentPlayer()
            setViewComparison(false)
        }
    }
    return(
        <div id='outer' onClick={(e) => {handleClick(e)}} className={modalStyles.wrapper}>
            <div className={modalStyles.innerWrapper}>
                <div className={modalStyles.playerWrapper}>
                    {player1 && generatePlayer(player1)}
                </div>
                <hr/>
                <div style={{position: 'relative'}}>
                    {AvailablePlayers()}
                    <div className={modalStyles.playerWrapper}>
                        {currentPlayer && generatePlayer(currentPlayer)}
                    </div>
                </div>
            </div>
        </div>
    )
}
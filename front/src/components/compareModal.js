import React, {useEffect, useState} from 'react'
import modalStyles from '../styles/modal.module.sass';

export default function CompareModal({player1, player2, setViewComparison, categories}){
    const [statCategories, setStatCategories] = useState()
    const [currentPlayer, setCurrentPlayer] = useState()

    useEffect(() => {
        let type = player1.playerInfo[0].position_type
        let relevantCategories = categories.filter((x) => x.position_type === type)
        console.log(player2)
        console.log(player1)
        setStatCategories(relevantCategories)
    },[])

    function generatePlayer(player){

        let info = player.playerInfo[0]
        let playerDetails = player.playerDetails[0]
        let positions = info.eligible_positions.join(', ')

        function generateStats(){
            return statCategories.map((stat) => {
                let playerStats = playerDetails.player_stats.stats.filter((x) => x.stat.stat_id == stat.stat_id)
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
                    <img src={playerDetails.image_url} alt='player_headshot' />
                    <h2>{info.name} - <span>{positions}</span></h2>
                    <p>Injury Status: {info.status ? info.status: "None"}</p>
                    <p>Percent Owned: {info.percent_owned}</p>
                </div>
                <div className={modalStyles.scoringStats}>
                    {statCategories && generateStats()}
                </div> 
                <div className={modalStyles.altStats}>

                </div>
            </>
        )
    }

    function handleChange(e){
        e.preventDefault()
        let selectedPlayer = e.target.options[e.target.selectedIndex]
        
        console.log(selectedPlayer.id)
    }
    function AvailablePlayers(){
        let positions = player1.playerDetails[0].position_type
        let swappable = player2.filter((x) => x['position_type'] == positions)
        return (
            <>
                <select
                    defaultValue={player1.playerDetails[0].primary_position}
                    onChange={(e) => handleChange(e)}
                >
                    {swappable.map((player) => {
                        console.log(player.player_id)
                        return(
                            <option value={player.selected_position} id={player.player_id} key={`option-${player.selected_position}-${player.player_id}`}>
                                <p>{player.name['full']} - <span>{player.selected_position}</span></p>
                            </option>
                        )
                    })}
                </select>
                {/* {generatePlayer()} */}
            </>
        )
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
                {/* Within this section, we want a drop down menu for every player that could be replaced by player 1 */}
                <div><p>Player 2</p>
                    {AvailablePlayers()}
                </div>
            </div>
        </div>
    )
}
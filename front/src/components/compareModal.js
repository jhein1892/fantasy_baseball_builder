import React, {useEffect, useState} from 'react'
import modalStyles from '../styles/modal.module.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRepeat, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import config from '../config';
import axios from 'axios';

export default function CompareModal({player1, player2, setViewComparison, categories}){
    const [statCategories, setStatCategories] = useState()
    const [currentPlayer, setCurrentPlayer] = useState()

    function handleChange(e){
        e.preventDefault()
        let selectedPlayer = e.target.options[e.target.selectedIndex]
        let newPlayer = player2.filter((x) => x.player_id == selectedPlayer.id)
        setCurrentPlayer(newPlayer[0])
    }

    function handleClick(e){
        e.preventDefault()
        if(e.target.id === 'outer'){
            setStatCategories()
            setCurrentPlayer()
            setViewComparison(false)
        }
    }

    function handleRosterChange(e, id){
        e.preventDefault();
        let type = e.target.name;
        console.log(e.target)
        let urlString = `${type}Player`
        axios.put(`${config.REACT_APP_API_ENDPOINT}/${urlString}`, {id:id})
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    function generatePlayer(player){
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
                        <button name='drop' className={modalStyles.actionButton} onClick={(e) => {handleRosterChange(e, player.player_id)}}><FontAwesomeIcon size='3x' color='#5d5d87' icon={faUserMinus}/></button>
                    } 
                    {!player.selected_position &&

                        <button name='add' className={modalStyles.actionButton} onClick={(e) => {handleRosterChange(e, player.player_id)}}><FontAwesomeIcon size='3x' color='#5d5d87' icon={faUserPlus}/></button>
                    }
                </div>
            </>
        )
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

    useEffect(() => {
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

    return(
        <div id='outer' onClick={(e) => {handleClick(e)}} className={modalStyles.wrapper}>
            <div className={modalStyles.innerWrapper}>
                <div className={modalStyles.playerWrapper}>
                    {player1 && generatePlayer(player1)}
                </div>
                <div className={modalStyles.midSection}>
                    <hr/>
                    <button className={modalStyles.actionButton} name='addDrop' onClick={(e) => handleRosterChange(e, [player1.player_id, currentPlayer.player_id])}><FontAwesomeIcon size='3x' color='#5d5d87' icon={faRepeat}/></button>
                    <hr/>
                </div>
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

// Add_Drop => Drop my player and add the one I'm comparing to
// Add player => Check if we have room, supply position options for the add
// Drop player => Drop player
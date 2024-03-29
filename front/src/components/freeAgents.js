import React, { useState } from 'react'
import axios from 'axios'
import freeAgentStyles from '../styles/freeAgents.module.sass'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight, faRepeat, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import config from '../config'; // REACT_APP_API_ENDPOINT

// Add in Waiver players

export default function FreeAgents({generateComparison}){
    const positions = ['All Batters','All Pitchers', 'C','1B','2B','3B','SS','LF','CF','RF','SP','RP']

    const [searchValue, setSearchValue] = useState('B')
    const [freeAgentData, setFreeAgentsData] = useState([])
    const [page, setPage] = useState(1)
    const [pageLength, setPageLength] = useState(23)
    const [newPlayers, setnewPlayers] = useState(false)
    const [playerStats, setPlayerStats] = useState([])

    function handleChange(e){
        e.preventDefault()
        let value = e.target.value;
        setnewPlayers(false)
        setPlayerStats([])
        setSearchValue(value)
    }

    function handleSubmit(e){
        e.preventDefault()
        axios.put(`${config.REACT_APP_API_ENDPOINT}/freeAgents`, {data:searchValue})
        .then((response) => {
            let data = response.data            
            setFreeAgentsData(data.availablePlayers)
            setnewPlayers(true)
        }) 
        .catch((error) => {
          console.log(error)
        })
    }

    async function handleRowClick(e, id){
        e.preventDefault()
        let playerDetails = await new Promise((resolve) => {
            let filteredData = playerStats.filter((x) => x.player_id == id);
            resolve(filteredData)
        })
        if(playerDetails.length > 0){
            generateComparison(playerDetails[0])
        }

    }

    // Adds player to roster
    function handlePlayerAdd(e, id){
        e.preventDefault()

        axios.put(`${config.REACT_APP_API_ENDPOINT}/addPlayer`, {id: id})
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    function generatePages(){
        let numValues = freeAgentData ? freeAgentData.length : 0
        
        let numPages = Math.floor(numValues / pageLength)
        numPages = numValues % pageLength > 0 ? numPages+1: numPages

        return Array.from({length:numPages}, (_, index) => index + 1).map((num) => {
            const pageNumStyles = classNames({
                [freeAgentStyles.active]: num === page
            })
            return(
                <p className={pageNumStyles}>{num}</p>
            )
        })
    }

    function generatePlayers() {
        // We are going to find the players that are between page - 1 and page times pagelength
        let startIndex = (page - 1) * pageLength
        let endIndex = (page * pageLength)
        
        let visiblePlayers = freeAgentData.slice(startIndex, endIndex)
        let playerIds = visiblePlayers.map((player) => {return player['player_id']})
        if(newPlayers && playerStats.length === 0){
            axios.put(`${config.REACT_APP_API_ENDPOINT}/playerStats`, {data: playerIds})
            .then((response) => {
                let playerData = response.data.player_details
                setPlayerStats(playerData)
            })
            .catch((error) => {
                console.log(error)
            })
        }


        let returnRows =  visiblePlayers.map((player) => {
            let positionList = player['eligible_positions'].join(', ')
            return (
                <>
                    {/* THis is going to be color coded based on comparision with current position player */}
                    {/* Also add an onclick handler which would bring up all of th stat categories, with color coded breakdowns compared to current player in that position. If multiple players, then we drop down menu to choose one*/}
                    <tr className={freeAgentStyles.playerRow} id={player.player_id}>
                        <td>{player.status && <span>{player.status}</span>}{player.name}</td>
                        <td>{positionList}</td>
                        <td>{player.percent_owned}</td>
                        <td><button disabled={playerStats.length === 0} onClick={(e) => handleRowClick(e, player.player_id)}>View Stats</button></td>
                        <td><button onClick={(e) => handlePlayerAdd(e, player.player_id)}>add</button></td>
                    </tr>
                </>
            )
        })
        return returnRows
    }

    function handlePageChange(e){
        // Set some boundaries to make sure we stay within available pages
        e.preventDefault()
        setPlayerStats([])
        let direction = e.target.name
        if (direction === 'next'){
            setPage(page+1)
        } else {
            setPage(page-1)
        }

    }

    return (
        <div className ={freeAgentStyles.wrapper}>
            <h1>Free Agents</h1>
            <form onChange={handleChange} onSubmit={handleSubmit}>                
                <select>
                    {positions.map((position, index) => {
                        let positionValue = position;
                        if(index < 2){
                            positionValue = index === 0 ? 'B' : 'P';
                        }
                        return (
                            <option value={positionValue}>{position}</option>
                        )
                    })}
                </select>
                <button type='submit'>Check Market</button>
            </form>
            <div className={freeAgentStyles.playerWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Positions</th>
                            <th>Percent Owned</th>
                            <th>Stats</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {freeAgentData.length > 0 && generatePlayers()}
                    </tbody>
                </table>
                <div>
                </div>
            </div>
            <div className={freeAgentStyles.pageControl}>
                <button name='back' onClick={handlePageChange}><FontAwesomeIcon size='3x' color='#5d5d87' icon={faChevronCircleLeft}/></button>
                <div className={freeAgentStyles.pageList}>
                    {generatePages()}
                </div>
                <button name='next' onClick={handlePageChange}><FontAwesomeIcon size='3x' color='#5d5d87' icon={faChevronCircleRight}/></button>
            </div>
        </div>
    )
}

// Sort function, Search function
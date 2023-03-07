import React, { useState } from 'react'
import axios from 'axios'
import freeAgentStyles from '../styles/freeAgents.module.sass'
import classNames from 'classnames';

export default function FreeAgents(){
    const positions = ['All Batters','All Pitchers', 'C','1B','2B','3B','SS','LF','CF','RF','SP','RP']

    const [searchValue, setSearchValue] = useState('B')
    const [freeAgentData, setFreeAgentsData] = useState([])
    const [page, setPage] = useState(1)
    const [pageLength, setPageLength] = useState(25)

    function handleChange(e){
        e.preventDefault()
        let value = e.target.value;
        setSearchValue(value)
    }


    function handleSubmit(e){
        e.preventDefault()
        axios.put('https://127.0.0.1:5000/freeAgents', {data:searchValue})
        .then((response) => {
          let data = response.data
          console.log(data.availablePlayers)

          setFreeAgentsData(data.availablePlayers)
        }) 
        .catch((error) => {
          console.log(error)
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
        
        return visiblePlayers.map((player) => {
            let positionList = player['eligible_positions'].join(', ')
            return (
                <tr className={freeAgentStyles.playerRow}>
                    <td>{player.name}</td>
                    <td>{positionList}</td>
                    <td>{player.percent_owned}</td>
                </tr>
            )
        })
        // let players = 
    }

    function handlePageChange(e){
        // Set some boundaries to make sure we stay within available pages
        e.preventDefault()
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
                <button name='back' onClick={handlePageChange}>prev</button>
                <div className={freeAgentStyles.pageList}>
                    {generatePages()}
                </div>
                <button name='next' onClick={handlePageChange}>next</button>
            </div>
        </div>
    )
}

// Sort function, Search function
import React, { useState } from 'react'
import axios from 'axios'

export default function FreeAgents(){
    const positions = ['All Batters','All Pitchers', 'C','1B','2B','3B','SS','LF','CF','RF','SP','RP']

    const [searchValue, setSearchValue] = useState('B')
    const [freeAgentData, setFreeAgentsData] = useState([])
    const [page, setPage] = useState(1)

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
        let numPages = Math.floor(numValues / 25)
        numPages = numValues%25 > 0 ? numPages+1: numPages
        console.log(numPages)
        for(let i = 0; i < numPages; i++){
            return(
                <p>{i}</p>
            )
        }
    }

    function handlePageChange(e){
        e.preventDefault()
        let direction = e.target.name
        if (direction === 'next'){
            setPage(page+1)
        } else {
            setPage(page-1)
        }
    }

    return (
        <div>
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
            <div>
                <h3>Player response</h3>
                <div>
                    <button name='back' onClick={handlePageChange}>prev</button>
                    {generatePages()}
                    <button name='next' onClick={handlePageChange}>next</button>
                </div>
            </div>
        </div>
    )
}

// Sort function, Search function
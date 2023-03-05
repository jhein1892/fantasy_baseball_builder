import React, { useState } from 'react'
import axios from 'axios'

export default function FreeAgents(){
    const positions = ['All Batters','All Pitchers', 'C','1B','2B','3B','SS','LF','CF','RF','SP','RP']

    const [searchValue, setSearchValue] = useState('B')

    function handleChange(e){
        e.preventDefault()
        let value = e.target.value;
        setSearchValue(value)
    }


    function handleSubmit(e){
        e.preventDefault()
        console.log(searchValue)
        axios.put('https://127.0.0.1:5000/freeAgents', {data:searchValue})
        .then((response) => {
          let data = response.data
          console.log(data)
        }) 
        .catch((error) => {
          console.log(error)
        })
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
        </div>
    )
}
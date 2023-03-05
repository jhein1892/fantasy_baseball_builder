import React from 'react'

export default function FreeAgents(){
    const positions = ['All Batters','All Pitchers', 'C','1B','2B','3B','SS','LF','CF','RF','SP','RP']
    return (
        <div>
            <h1>Free Agents</h1>
            <select>
                {positions.map((position) => {
                    return (
                        <option>{position}</option>
                    )
                })}
            </select>

            <button>Check Market</button>
        </div>
    )
}
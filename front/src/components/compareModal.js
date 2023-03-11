import React from 'react'
import modalStyles from '../styles/modal.module.sass';

export default function CompareModal({player1, player2, setViewComparison}){

    function handleClick(e){
        e.preventDefault()
        if(e.target.id === 'outer'){
            setViewComparison(false)
        }
    }
    return(
        <div id='outer' onClick={(e) => {handleClick(e)}} className={modalStyles.wrapper}>
            <div className={modalStyles.innerWrapper}>
                <div><p>Player 1</p></div>
                <hr/>
                <div><p>Player 2</p></div>
            </div>
        </div>
    )
}
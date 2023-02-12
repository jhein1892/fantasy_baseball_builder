import React from 'react';
import '../styles/header.modules.css';

export default function Header({setUserInfo, userInfo})
{
    function onChangeHandler(e){
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        setUserInfo(prev => ({...prev, [`${name}`]: value}))
    }
    return (
        <div className='headerWrapper'>
            <form 
                onChange={(e) => onChangeHandler(e)}
            >
                <div>
                    <label>League ID: </label>
                    <input name='league_id'></input>
                </div>
                <div>
                    <label>Team Name: </label>
                    <input name='team_name' disabled={userInfo['league_id'] ? false : true}></input>
                </div>
            </form>
        </div>
    )
}
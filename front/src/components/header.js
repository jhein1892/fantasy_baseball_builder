import React from 'react';
import headerStyles from '../styles/header.module.sass';

export default function Header({setUserInfo, userInfo, submitValues})
{
    function onChangeHandler(e){
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        setUserInfo(prev => ({...prev, [`${name}`]: value}))
    }
    return (
        <div className={headerStyles.headerWrapper}>
            <form 
                onChange={(e) => onChangeHandler(e)}
                onSubmit={submitValues}
            >
                <div>
                    <label>League ID: </label>
                    <input name='league_id'></input>
                </div>
                <div>
                    <label>Team Name: </label>
                    <input name='team_name' disabled={userInfo['league_id'] ? false : true}></input>
                </div>
                <button type='submit' disabled={(userInfo['league_id'] && userInfo['team_name']) ? false : true}>Submit</button>
            </form>
        </div>
    )
}
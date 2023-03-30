import React, { useEffect } from 'react';
import headerStyles from '../styles/header.module.sass';
import classNames from 'classnames';


export default function Header({leagueNews})
{
    useEffect(() => {
        console.log('league', leagueNews)
    },[leagueNews])


    return (
        <div className={headerStyles.headerWrapper} id='header'>
         
        </div>
    )
}
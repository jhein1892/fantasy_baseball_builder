import React, { useEffect, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import classNames from 'classnames';


export default function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([])

    function generateNews(){
        return newsType.map((type) => {
            return (
                <>
                    <h3>{type}</h3>
                    {
                    leagueNews[type].map((news) => {
                        return (
                            <p>{news.transaction_id}</p>
                        )
                    })
                    }
                </>

            )
        })
    }

    useEffect(() => {
        if(leagueNews){
            setNewsType(Object.keys(leagueNews))
        }

        console.log('league', leagueNews)
    },[leagueNews])


    return (
        <div className={headerStyles.headerWrapper} id='header'>
            {leagueNews && generateNews()}
        </div>
    )
}
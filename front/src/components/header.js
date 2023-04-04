import React, { useEffect, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import classNames from 'classnames';
import Ticker from 'react-ticker';

const NewsTicker = () => (
    <Ticker>
        {({ index }) => (
            <>
            <h1 style={{ paddingRight: "0.5em" }}>
                This is the Headline of element #{index}!
            </h1>
            </>
        )}
    </Ticker>
)

function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([])

    function generateNews(){
        return newsType.map((type) => {
            return (
                <div className={headerStyles.typeWrapper}>
                    <h3>{type}</h3>
                    {
                    leagueNews[type].map((news, index) => {
                        return (
                            <p>{news.transaction_id}</p>
                        )
                    })
                    }
                </div>
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
            {generateNews()}
        </div>
    )
}




export default Header;
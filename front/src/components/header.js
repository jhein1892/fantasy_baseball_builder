import React, { useCallback, useEffect, useRef, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import classNames from 'classnames';

function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([])
    const [displayIndex, setDisplayIndex] = useState(0)

    function generateNews(){
        return newsType.map((type, index) => {
            let newsStyles = classNames(headerStyles.typeWrapper,{
                [headerStyles.visible]: index === displayIndex
            })

            return (
                <div className={newsStyles}>
                    <p>{type}</p>
                    <div className={headerStyles.typeContent}>

                    </div>
                </div>
            )   
            // return (
            //     <div className={headerStyles.typeWrapper}>
            //         <h3>{type}</h3>
            //         {
            //         leagueNews[type].map((news, index) => {
            //             return (
            //                 <p>{news.transaction_id}</p>
            //             )
            //         })
            //         }
            //     </div>
            // )
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
            <div className={headerStyles.leftSide}>

            </div>
            <div className={headerStyles.rightSide}>
                {generateNews()}
            </div>
        </div>
    )
}




export default Header;
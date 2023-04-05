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
                    <h3>{type}</h3>
                    <div className={headerStyles.typeContent}>
                        {leagueNews[type].map((news, index) => {

                            let players = news['players']
                            let count = players['count']
                            let transType = news['type']
                            

                            for(let i = 0; i < count; i++){
                                let playerName = players[i]['player'][0][2]['name']['full']
                                let transDetails;
                                if(players[i]['player'][1]['transaction_data'].length){
                                    transDetails = players[i]['player'][1]['transaction_data'][0]
                                } else {
                                    transDetails = players[i]['player'][1]['transaction_data']
                                }

                            }
                            // console.log(players)
                            
                            return (
                                <div className={headerStyles.transaction}>
                                    <p>{transType}</p>
                                    {
                                        
                                    }
                                </div>
                            )
                        })}
                    </div>
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
            <div className={headerStyles.leftSide}>

            </div>
            <div className={headerStyles.rightSide}>
                {generateNews()}
            </div>
        </div>
    )
}




export default Header;
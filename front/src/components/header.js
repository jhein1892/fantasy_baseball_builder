import React, { useCallback, useEffect, useRef, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import classNames from 'classnames';

function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([])
    const [displayIndex, setDisplayIndex] = useState(0)

    function generateNewsType(count, players){
        // console.log('here', count)
        let arr = Array.from({length: count}, (_,index) => index);
        return arr.map((i) => {
            let playerName = players[i]['player'][0][2]['name']['full']
            let transDetails;
            if(players[i]['player'][1]['transaction_data'].length){
                transDetails = players[i]['player'][1]['transaction_data'][0]
            } else {
                transDetails = players[i]['player'][1]['transaction_data']
            }
            return (
                <p>{playerName}/{transDetails.type}</p>
            )
        })
        
        
        // for(let i = 0; i < count; i++){
        //     
        //     
        //  
        //     return(
        //         <p>{playerName}</p>
        //     )
        //     console.log(playerName, transDetails)
        // }
    }

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
                            let keyPrefix;
                            let details;
                            let teamName;

                            // Need to find the team Name
                            try{
                                if (players[0]['player'][1]['transaction_data'].length){
                                    details = players[0]['player'][1]['transaction_data'][0]
                                } else {
                                    details = players[0]['player'][1]['transaction_data']
                                }
                                if(details['type'] === 'add'){
                                    // destination
                                    keyPrefix = 'destination'
                                } else {
                                    // source
                                    keyPrefix = 'source'
                                }
                                teamName = details[`${keyPrefix}_team_name`]
                            } catch(error){
                                console.error(error)
                            }


                            let count = players['count']
                            let transType = news['type']
                            // console.log(news)
                            return (
                                <div className={headerStyles.transaction}>
                                    <p className={headerStyles.teamName}>{teamName} (<span>{transType}</span>)</p>
                                    {/* <hr /> */}
                                    {generateNewsType(count, players)}
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
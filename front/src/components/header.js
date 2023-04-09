import React, { useCallback, useEffect, useRef, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';

function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);

    function generateNewsType(count, players){
        // console.log('here', count)
        let arr = Array.from({length: count}, (_,index) => index);
        return arr.map((i) => {

            let playerName = players[i]['player'][0][2]['name']['full']
            let playerPosition = players[i]['player'][0][4]['display_position']
            let transDetails;
            if(players[i]['player'][1]['transaction_data'].length){
                transDetails = players[i]['player'][1]['transaction_data'][0]
            } else {
                transDetails = players[i]['player'][1]['transaction_data']
            }
            let iconSrc;
            let iconColor;
            if (transDetails.type === 'add'){
                iconSrc = faPlus
                iconColor = 'green'
            } else {
                iconSrc = faMinus
                iconColor = 'red'
            }
            return (
                <p className={headerStyles.playerName}><FontAwesomeIcon icon={iconSrc} size='xs' color={iconColor}/> {playerName} <span>{playerPosition}</span></p>
            )
        })
    }

    function generateNews(){
        
        return newsType.map((type, index) => {
            let newsStyles = classNames(headerStyles.typeWrapper,{
                [headerStyles.visible]: index === displayIndex % 3
            })

            return (
                <div className={newsStyles}>
                    <div className={headerStyles.typeHeader}>
                        <button disabled={displayIndex === 0 ? true : false} onClick={() => {setDisplayIndex(displayIndex - 1)}}>
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                        <h3>{type}</h3>
                        <button  onClick={() => {setDisplayIndex(displayIndex + 1)}}>
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </button>
                    </div>
                    <div className={headerStyles.typeContent}>
                        {leagueNews[type].length > 0 ? leagueNews[type].map((news, index) => {
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
                                    <hr />
                                    {generateNewsType(count, players)}
                                </div>
                            )
                        }) : <h3 className={headerStyles.noNews}>Nothing to Report</h3>}
                    </div>
                </div>
            )   

        })
    }

    function generateDisplayLights(){
        let newLights = Array.from({length: newsType.length}, (value, index) => index);
        return newLights.map((x, index) => {
            let lightClass = classNames({
                [headerStyles.activeLight]: index === displayIndex % 3
            })
            return (
                <div className={lightClass}></div>
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
                {generateDisplayLights()}
            </div>
            <div className={headerStyles.rightSide}>
                {generateNews()}
            </div>
        </div>
    )
}




export default Header;
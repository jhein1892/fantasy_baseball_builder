import React, { useCallback, useEffect, useRef, useState } from 'react';
import headerStyles from '../styles/header.module.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';

function Header({leagueNews}) {
    const [newsType, setNewsType] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);

    function generateNewsType(players){
        console.log(players)
        let arr = Array.from({length: players.count}, (_,index) => index);
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
            } else if (transDetails.type ==='drop') {
                iconSrc = faMinus
                iconColor = 'red'
            } else { // Implement a trade option.
                iconSrc = faMinus
                iconColor = 'yellow'
                
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
                            let team2Name;
                            let tradeObj = {}

                            let transType = news['type']
                            let count = players['count']

                            // Need to find the team Name
                            try{
                                if(transType !== 'trade'){
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
                                }
                                else {
                                    teamName = news['trader_team_name'];
                                    team2Name = news['tradee_team_name'];
                                    Object.keys(players).forEach((index) => {
                                        if(index != 'count'){
                                            let destination = players[index]['player'][1]['transaction_data'][0]['destination_team_name']
                                            if (tradeObj.hasOwnProperty(destination)){
                                                tradeObj[destination].push(players[index])
                                                tradeObj[destination].count++;
                                            } else {
                                                tradeObj[destination] = [players[index]]
                                                tradeObj[destination].count = 1
                                            }
                                        }
                                    })
                                    console.log(tradeObj)
                                }
                            } catch(error){
                                console.error(error)
                            }

                            let nameContent = team2Name ? teamName + " / " + team2Name : teamName;

                            return (
                                <div className={headerStyles.transaction}>
                                    <p className={headerStyles.teamName}>{nameContent} (<span>{transType}</span>)</p>
                                    <hr />
                                    {/* Update this to generate multiple options of we have a trade */}
                                    {generateNewsType(players)}
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
            console.log(leagueNews)
            setNewsType(Object.keys(leagueNews))
        }
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
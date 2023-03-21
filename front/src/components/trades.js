import React, {useEffect, useState} from 'react'
import axios from 'axios'
import config from '../config';
import tradeStyles from '../styles/trades.module.sass'
import classNames from 'classnames';

// Need to make a way of switching between trades
// Need to check what happens when I propose a trade
// Need to connect my buttons

export default function Trades({ categories }){
    const [tradeData, setTradeData] = useState()
    const [displayValue, setDisplayValue] = useState(0)


    function generateTradeList(){
        return tradeData.map((trade, index) => {
            let rowClasses = classNames({
                [tradeStyles.activeRow]: displayValue == index
            })
            return (
                <tr className={rowClasses}> 
                    <td>{trade.status}</td>
                    <td>{trade.trader_team_key.name}</td>
                    <td>---</td>
                    <td><button>Accept</button></td>
                    <td><button>Decline</button></td>
                </tr>
            )
        })
    }

    function generatePlayers(player, playerCats){
            let playerStats = player.player_stats.stats
            return (
                <tr>
                    <td className={tradeStyles.playerName}>{player.name.full}</td>
                    <td>{player.display_position}</td>
                    {playerCats.map((cat) => {
                        if(cat.stat_id){
                            let value = playerStats.filter((x) => x.stat.stat_id == cat.stat_id)
                            value = value[0].stat
                            console.log(value, playerStats, cat)
                            
                            return (
                                <td>{value.value}</td>
                            )
                        }
                    })}
                </tr>
                    
            )
        // }
    }

    function generateTradeDetails(team){
        let detailsData = tradeData[displayValue]
        return (
            <>
                <h3>{detailsData[`${team}_team_key`].name}</h3>
                {detailsData[`${team}_players`].map((player) => {
                    let playerCats = categories.filter((x) => x.position_type == player.position_type)
                    return(
                        <table>
                            <thead>
                                <tr>
                                    <td className={tradeStyles.playerName}>Name</td>
                                    <td>Positions</td>
                                    {playerCats.map((x) => {
                                        return (<td>{x.display_name}</td>)
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {generatePlayers(player, playerCats)}
                            </tbody>
                        </table>
                    )
                })}
            </>
        )
    }

    useEffect(() => {
        if(!tradeData){
            axios.get(`${config.REACT_APP_API_ENDPOINT}/availableTrades`)
            .then((response) => {
                setTradeData(response.data.pending_trades)
            })
        }
    },[])

    return(
        <div className={tradeStyles.wrapper}>
        {tradeData &&
            <>
                <div className={tradeStyles.tradeList}>
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Team</th>
                                <th>Assessment</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {generateTradeList()}
                        </tbody>
                    </table>
                </div>
                <div className={tradeStyles.tradeDescription}>
                    <div className={tradeStyles.tradeDetails}>
                        { categories && generateTradeDetails('trader')}
                    </div>
                    <div className={tradeStyles.tradeDetails}>
                        { categories && generateTradeDetails('tradee')}
                    </div>
                </div>
            </>
        }
        </div>
    )
}
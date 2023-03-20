import React, {useEffect, useState} from 'react'
import axios from 'axios'
import config from '../config';
import tradeStyles from '../styles/trades.module.sass'
import classNames from 'classnames';

export default function Trades(){
    const [tradeData, setTradeData] = useState()
    const [displayValue, setDisplayValue] = useState(0)


    function generateTradeList(){
        console.log(tradeData)
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

                </div>
            </>
        }
        </div>
    )
}
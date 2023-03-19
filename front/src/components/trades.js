import React, {useEffect, useState} from 'react'
import axios from 'axios'
import config from '../config';
import tradeStyles from '../styles/trades.module.sass'

export default function Trades(){
    const [tradeData, setTradeData] = useState()

    useEffect(() => {
        axios.get(`${config.REACT_APP_API_ENDPOINT}/availableTrades`)
        .then((response) => {
            setTradeData(response.data.pending_trades)
        })
    },[])

    return(
        <div className={tradeStyles.wrapper}>
        {tradeData &&
            <>
                <div>

                </div>
                <div>

                </div>
            </>
        }
        </div>
    )
}
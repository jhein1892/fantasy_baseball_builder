import React, {useEffect, useState} from 'react'
import axios from 'axios'
import config from '../config';

export default function Trades(){

    useEffect(() => {
        axios.get(`${config.REACT_APP_API_ENDPOINT}/availableTrades`)
        .then((response) => {
            console.log(response.data)
        })
    },[])

    return(
        <h1>Trades</h1>
    )
}
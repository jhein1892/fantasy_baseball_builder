import Header from './components/header';
import Body from './components/body';
import axios from 'axios';

import React, { useState, useEffect, useCallback } from 'react';
import config from './config';
import NewsTicker from './components/header';

function App() {

  // Information about the roster for the team
  const [teamData, setTeamData] = useState({})
  const [leagueNews, setLeagueNews] = useState()
  const [weeklyStats, setWeeklyStats] = useState()

  // Could turn this into a function once I need to not only have my team loading.

  function standardizeStats(data){
    
    const newData = {...data}
    Object.keys(newData).forEach((player) => {

      const calcStat = {
       'ERA': newData[player]['ER'] / newData[player]['IP'],
       'WHIP': (newData[player]['BB'] + newData[player]['H']) / newData[player]['IP'],
       'SO/W': newData[player]['K'] / newData[player]['BB']
      }

      let statsArray = []
      for (let key in newData[player]){
        if(newData[player][key] === 'inf'){
          statsArray.push({'stat_name': key, 'value': calcStat[key]})
        } else {
          statsArray.push({'stat_name': key, 'value': newData[player][key]})
        }
      }
      newData[player] = statsArray
    })
    return newData

  }

  const gatherInfo = useCallback((urls) => {
    axios.all(urls.map(url => axios.get(url)))
      .then(axios.spread((teamResponse, leagueResponse, weeklyResponse) => {
        let teamData = teamResponse.data
        let leagueNews = leagueResponse.data
        let weeklyData = standardizeStats(weeklyResponse.data)
        // console.log(teamData)
        // console.log(weeklyData)
        setTeamData(teamData)
        setLeagueNews(leagueNews)
        setWeeklyStats(weeklyData)
      }))
      .catch((error) => {
        console.error(error)
      })
  }, [])



  useEffect(() => {
    console.log('firing')
    if(!weeklyStats || !leagueNews || Object.keys(teamData) == 0){
      const urls = [
        `${config.REACT_APP_API_ENDPOINT}/`,
        `${config.REACT_APP_API_ENDPOINT}/leagueNews`,
        `${config.REACT_APP_API_ENDPOINT}/weekStats`,
      ]
        gatherInfo(urls);
        
      }
      
     
    },[])

  return (
    <div>
      <Header 
        leagueNews={leagueNews}
      />
        <Body 
          data={teamData}
          weeklyStats={weeklyStats}
        />
    </div>
  );
}

export default App;

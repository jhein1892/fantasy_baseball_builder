import Header from './components/header';
import Body from './components/body';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import config from './config';
import NewsTicker from './components/header';

function App() {

  // Information about the roster for the team
  const [teamData, setTeamData] = useState({})
  const [leagueNews, setLeagueNews] = useState()
  const [weeklyStats, setWeeklyStats] = useState()

  // Could turn this into a function once I need to not only have my team loading.
  useEffect(() => {
    const urls = [
      `${config.REACT_APP_API_ENDPOINT}/`,
      `${config.REACT_APP_API_ENDPOINT}/leagueNews`,
      `${config.REACT_APP_API_ENDPOINT}/weekStats`,
    ]

    function standardizeStats(data){
      Object.keys(data).forEach((player) => {
        let statsArray = []
        for (let key in data[player]){
          statsArray.push({'stat_name': key, 'value': data[player][key]})
        }
        data[player] = statsArray
      })

     return data
    }
-
    axios.all(urls.map(url => axios.get(url)))
    .then(axios.spread((teamResponse, leagueResponse, weeklyResponse) => {
      let teamData = teamResponse.data
      let leagueNews = leagueResponse.data
      let weeklyData = standardizeStats(weeklyResponse.data)
            
      setTeamData(teamData)
      setLeagueNews(leagueNews)
      setWeeklyStats(weeklyData)
    }))
    .catch((error) => {
      console.error(error)
    })
  },[])

  return (
    <div>
      <Header 
        leagueNews={leagueNews}
      />
      { teamData &&
        <Body 
          data={teamData}
          weeklyStats={weeklyStats}
        />
      }
    </div>
  );
}

export default App;

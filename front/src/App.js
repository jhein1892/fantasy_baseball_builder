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

    function standardizeStats(weeklyData){
      Object.keys(weeklyData).forEach((player) => {
        let statsArray = []
        for (let key in weeklyData[player]){
          statsArray.push({'stat_name': key, 'value': weeklyData[player][key]})
        }
        weeklyData[player] = statsArray
      })

      console.log(weeklyData)
    }
-
    axios.all(urls.map(url => axios.get(url)))
    .then(axios.spread((teamResponse, leagueResponse, weeklyResponse) => {
      let teamData = teamResponse.data
      let leagueNews = leagueResponse.data
      let weeklyData = weeklyResponse.data
            
      setTeamData(teamData)
      setLeagueNews(leagueNews)
      standardizeStats(weeklyData)
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

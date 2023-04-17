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

  // Could turn this into a function once I need to not only have my team loading.
  useEffect(() => {
    const urls = [
      `${config.REACT_APP_API_ENDPOINT}/`,
      `${config.REACT_APP_API_ENDPOINT}/leagueNews`,
      `${config.REACT_APP_API_ENDPOINT}/weekStats`,
    ]

    axios.all(urls.map(url => axios.get(url)))
    .then(axios.spread((teamResponse, leagueResponse, weeklyResponse) => {
      let teamData = teamResponse.data
      let leagueNews = leagueResponse.data
      let weeklyData = weeklyResponse.data
      
      console.log(weeklyData)
      
      setTeamData(teamData)
      setLeagueNews(leagueNews)
    }))
    .catch((error) => {
      console.error(error)
    })

  //   axios.get(`${config.REACT_APP_API_ENDPOINT}/`)
  //   .then((response) => {
  //     console.log(response.data)
  //     let teamData = response.data.teamData
  //     setTeamData(teamData)

  //     // let leagueNews = response.data.leagueData      
  //     // setLeagueNews(leagueNews)
  //   }) 
  //   .catch((error) => {
  //     console.log(error)
  //   })
  },[])

  return (
    <div>
      <Header 
        leagueNews={leagueNews}
      />
      {/* <NewsTicker leagueNews={leagueNews}/> */}
      { teamData &&
        <Body 
          data={teamData}
        />
      }
    </div>
  );
}

export default App;

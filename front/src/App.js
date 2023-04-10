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
    axios.get(`${config.REACT_APP_API_ENDPOINT}/`)
    .then((response) => {
      let teamData = response.data.teamData
      setTeamData(teamData)
      console.log(teamData)

      let leagueNews = response.data.leagueData      
      setLeagueNews(leagueNews)
    }) 
    .catch((error) => {
      console.log(error)
    })
  },[])

  return (
    <div>
      <Header 
        leagueNews={leagueNews}
      />
      {/* <NewsTicker leagueNews={leagueNews}/> */}
      <Body 
        data={teamData}
      />
    </div>
  );
}

export default App;

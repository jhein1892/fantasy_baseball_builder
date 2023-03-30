import Header from './components/header';
import Body from './components/body';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import config from './config';

function App() {
  // league_id and team_name
  const [userInfo, setUserInfo] = useState({});
  // Information about the roster for the team
  const [teamData, setTeamData] = useState({})
  const [scrolled, setScrolled] = useState(true);
  // 
  // function submitValues(e){
  //   e.preventDefault();
  //   axios.put(`${config.REACT_APP_API_ENDPOINT}/`, userInfo)
  //   .then((response) => {
  //     let data = response.data

  //     setTeamData(data)
  //   }) 
  //   .catch((error) => {
  //     console.log(error)
  //   })
  // }

  //  Temporary UseEffect for development of teamRoster component
  useEffect(() => {
    axios.put(`${config.REACT_APP_API_ENDPOINT}/`, userInfo)
    .then((response) => {
      let data = response.data
      setTeamData(data)
    }) 
    .catch((error) => {
      console.log(error)
    })
  },[])

  return (
    <div>
      <Header 
      />
      <Body 
        userInfo={userInfo}
        data={teamData}
      />
    </div>
  );
}

export default App;

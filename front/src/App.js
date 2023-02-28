import Header from './components/header';
import Body from './components/body';
import axios from 'axios';
// import https from 'https';
import React, { useState, useEffect } from 'react';
import config from './config';

// const agent= new https.Agent({
//   rejectUnauthorized:false
// })

function App() {
  // league_id and team_name
  const [userInfo, setUserInfo] = useState({});
  // Information about the roster for the team
  const [teamData, setTeamData] = useState({})
  const [scrolled, setScrolled] = useState(false);
  // 
  function submitValues(e){
    e.preventDefault();
    axios.put(`${config.REACT_APP_API_ENDPOINT}/`, userInfo)
    .then((response) => {
      let data = response.data
      setTeamData(data)
    }) 
    .catch((error) => {
      console.log(error)
    })
  }

  //  Temporary UseEffect for development of teamRoster component
  useEffect(() => {
    axios.put('https://127.0.0.1:5000/', userInfo)
    .then((response) => {
      let data = response.data
      setTeamData(data)
    }) 
    .catch((error) => {
      console.log(error)
    })
  },[])


  useEffect(() => {
    const handleScroll=()=>{
      if(window.scrollY > 15 && !scrolled){
        setScrolled(true);
      } else if(window.scrollY < 15 && scrolled) {
        setScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  })

  return (
    <div>
      <Header 
        setUserInfo={setUserInfo} 
        userInfo={userInfo}
        submitValues={submitValues}
        scrolled={scrolled}
      />
      <Body 
        userInfo={userInfo}
        data={teamData}
      />
    </div>
  );
}

export default App;

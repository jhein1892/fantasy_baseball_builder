import Header from './components/header';
import Body from './components/body';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import config from './config';

function App() {
  // league_id and team_name
  const [userInfo, setUserInfo] = useState({});
  // Information about the roster for the team
  const [rosterData, setRosterData] = useState([]);

  const [scrolled, setScrolled] = useState(false);

  function submitValues(e){
    e.preventDefault();

    axios.put(`${config.REACT_APP_API_ENDPOINT}/`, userInfo)
    .then((response) => {
      setRosterData(response.data);
    }) 
    .catch((error) => {
      console.log(error)
    })

  }


  useEffect(() => {
    const handleScroll=()=>{
      // console.log('Scrolling',window.scrollY)
      // let element = document.getElementById('header');
      // console.log(element)
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
    <div onClick={() => console.log('clicked App')} onScroll={() => console.log('scrolled IN App')}>
      <Header 
        setUserInfo={setUserInfo} 
        userInfo={userInfo}
        submitValues={submitValues}
        scrolled={scrolled}
      />
      <Body 
        userInfo={userInfo}
        rosterData={rosterData}
        setRosterData={setRosterData}
      />
    </div>
  );
}

export default App;

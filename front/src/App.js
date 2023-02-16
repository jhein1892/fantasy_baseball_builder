import './App.css';
import Header from './compnents/header';
import Body from './compnents/body';
import axios from 'axios';
import { useState } from 'react';


function App() {
  // league_id and team_name
  const [userInfo, setUserInfo] = useState({});
  // Information about the roster for the team
  const [rosterData, setRosterData] = useState([]);

  function submitValues(e){
    e.preventDefault();

    axios.put(`${process.env.REACT_APP_API_ENDPOINT}/`, userInfo)
    .then((response) => {
      setRosterData(response.data);
    }) 
    .catch((error) => {
      console.log(error)
    })

  }

  return (
    <div className="App">
      <Header 
        setUserInfo={setUserInfo} 
        userInfo={userInfo}
        submitValues={submitValues}
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

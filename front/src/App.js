import './App.css';
import Header from './compnents/header';
import Body from './compnents/body';
import axios from 'axios';
import { useState } from 'react';


function App() {
  const [userInfo, setUserInfo] = useState({});

  function submitValues(e){
    e.preventDefault();

    axios.put(`${process.env.REACT_APP_API_ENDPOINT}/`, userInfo)
    .then((response) => {
      console.log(response);
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
      />
    </div>
  );
}

export default App;
